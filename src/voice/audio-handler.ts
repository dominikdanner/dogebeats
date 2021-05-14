import ytdl, { validateURL, videoInfo } from 'ytdl-core';
import color from 'colors'
import { emitter } from './voice-emitter'
import { bot } from '../config/config'
import { ISong } from '../interface/Song'
import { search } from 'yt-search'
import { Client, Message, MessageReaction, StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js';
import { successEmbed } from '../style/success-embed';
import { infoEmbed } from '../style/song-embed'
import { errorEmbed } from '../style/error-embed'

export class AudioHandler {
    //Status of the audiofile playing
    public isPlaying: boolean;
    //Current song witch is playing
    public currentSong: ISong;
    //Current Reaction Controller ID
    public controllerEmbed: any;
    
    //Discord Client
    protected client: Client;
    //Channel Connection
    protected channelConnection: VoiceConnection;
    //If Error happens this will have a value.
    protected AudioError: any;
    //Audio Dispatcher with Current Song paired.
    protected Dispatcher: StreamDispatcher;
    //Channel you are currently in.
    protected currentChannel: any;
    
    constructor (client: Client) {
        this.client = client
    }
    /**
     * @type String
     */
    getArgsString = (msg: Message, remove: string): string => {
        const { content } = msg
        return content.replace(remove, '')
    }
    /**
     * @type Array
     */
    getArgs = (msg: Message): string[] => {
        const { content } = msg
        let args = content.split(' ') ; args.shift()
        return args
    }
    
    fetchAudioFile = (url: string) => {
        const audioStream = ytdl(url, { filter: 'audioonly' })
        audioStream.on('error', (err) => err)
        return audioStream
    }
    
    ControllEmbed = async (msg: Message) => {
        const Embed = await msg.channel.send(infoEmbed(msg, this.currentSong.title, msg.author.tag, this.currentSong.thumbnail))
        Embed.react(bot.interface.stop)
        Embed.react(bot.interface.loop)
        Embed.react(bot.interface.back)
        Embed.react(bot.interface.pause)
        Embed.react(bot.interface.forward)
        return Embed
    }
    
    StateManager = async() => {
        await this.Dispatcher.once('start', () => this.isPlaying = true )
        await this.Dispatcher.once('finish', () => this.isPlaying = false)
        await this.Dispatcher.once('error', async (err: any) => this.AudioError = err)
    }
}

export class MusicPlayer extends AudioHandler{

    MusicPlayer = () => {
        /**
         * All Textbased Commands
         */
        this.client.on('message', (msg: Message) => {
            if(msg.content.startsWith(`${bot.PREFIX}${bot.commands.play.name}`)){
                msg.delete()
                emitter.emit('queue-stream', msg, this.getArgsString(msg, `${ bot.PREFIX }${bot.commands.play.name}`), true)
            }
        })
    
        //Handles Reaction Controller and Emits correct Event
        this.client.on('messageReactionAdd', (reaction: MessageReaction, user: any) =>{
            if(user.tag === this.client.user?.tag) return;
            if(reaction.message.id == this.controllerEmbed.id){
                if(reaction.emoji.name == bot.interface.pause) return emitter.emit('pause-stream', reaction.message)
                else if(reaction.emoji.name == bot.interface.stop) return emitter.emit('stop-stream', reaction.message)
                else if(reaction.emoji.name == bot.interface.loop) {
                    reaction.message.channel.send(successEmbed('Loop enabled'))
                    return emitter.emit('loop-stream', reaction.message)
                } else if(reaction.emoji.name == bot.interface.back) return emitter.emit('history-back', reaction.message, this.currentSong)
                else if(reaction.emoji.name == bot.interface.forward) return emitter.emit('history-foward', reaction.message)
            }
        })
        
        emitter.on('queue-stream', (msg: Message, data: string, HistoryAdd: boolean) => {
            //Dynamic Varibales
            this.currentChannel = msg!.member!.voice.channel
            
            if(data == "") return msg!.channel.send(errorEmbed('Enter a valid Text/URL'))
            if(!this.currentChannel) return msg!.channel.send(errorEmbed('You are not in a Channel.'))
            this.currentChannel!.join().then(async(connection: VoiceConnection) => {
                console.time('Queue-Stream')
                console.log('\n-------- Song --------')
                this.channelConnection = connection
                if(validateURL(data)) {
                    //Youtube Link/URL
                    const url = data.replace(' ', '')
                    const audio = this.fetchAudioFile(url)
                    this.Dispatcher = connection.play(audio)
                    await ytdl.getInfo(url).then((info: videoInfo) => this.currentSong = { title: info.videoDetails.title, url: url, thumbnail: info.videoDetails.thumbnails[0].url })
                } else {
                    //Youtube Search
                    const { videos } = await search(data).catch((err: any) => { throw err })
                    if(!videos.length) return msg.channel.send(errorEmbed('Song not found.'))
                    const audio = this.fetchAudioFile(videos[0].url)
                    this.currentSong = { title: videos[0].title, url: videos[0].url, thumbnail: videos[0].thumbnail }
                    this.Dispatcher = connection.play(audio)
                }
                //Sending Controll Embed and assigne Variable)
                this.StateManager().then(_ => console.log(`Statemanager: ${color.green('ACTIVE')}`))
                if(HistoryAdd) emitter.emit('history-add', this.currentSong, this.client)
                this.controllerEmbed = await this.ControllEmbed(msg)
                console.timeEnd('Queue-Stream')
            }).catch((err: Error) => console.log(err))
            //Listening for events and updating State Variables
        })

        /**
         * Listening for all events to controll the Audiostream
         * @param Message from Discord.Message Class
         * @returns
         */
        emitter.on('stop-stream', (msg: Message) => {
                const channel: VoiceChannel = this.currentChannel
                if(channel == null || undefined) return msg.channel.send(errorEmbed('Bot is not in use right now.'))
                if(channel.id == msg.member?.voice.channelID) {
                    this.currentChannel = null
                    channel.leave()
                } else msg.channel.send('You are not in a the right channel.')
        })

        emitter.on('pause-stream', (msg: Message) => {
            if(this.isPlaying) {
                this.Dispatcher.pause()
                this.isPlaying = false
            } else msg.channel.send(errorEmbed('Bot is not playing.'))
        })

        emitter.on('loop-stream', (msg: Message) => {
            this.Dispatcher.on('finish', () => {
                const dispatcher = this.channelConnection.play(this.fetchAudioFile(this.currentSong.url))
                this.Dispatcher = dispatcher
                this.StateManager()
                emitter.emit('loop-stream', msg)
            })
        })
    }
}