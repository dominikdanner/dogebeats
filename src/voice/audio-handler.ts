import ytdl, { validateURL, videoInfo } from 'ytdl-core';
import event from 'events'
import { bot } from '../config/config'
import { ISong } from '../interface/Song'
import yts from 'yt-search'
import { Client, Message, MessageReaction, StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js';
import { successEmbed } from '../style/success-embed';
import { infoEmbed } from '../style/song-info'
import { errorEmbed } from '../style/error-embed'
const emitter = new event.EventEmitter()

export class AudioHandler {
    //Status of the audiofile playing
    public isPlaying: boolean;
    //Current song witch is playing
    public currentSong: ISong;
    //Current Reaction Controller ID
    public reactionEmbed: any;
    
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
        //Embed.react(bot.interface.back)
        Embed.react(bot.interface.pause)
        //Embed.react(bot.interface.resume)
        //Embed.react(bot.interface.forward)
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
                emitter.emit('queue-stream', msg, this.getArgsString(msg, `${ bot.PREFIX }${bot.commands.play.name}`))
            }
        })
    
        //Handles Reaction Controller and Emits correct Event
        this.client.on('messageReactionAdd', (reaction: MessageReaction, user: any) =>{
            if(user.tag === this.client.user?.tag) return;
            if(reaction.message.id == this.reactionEmbed.id){
                if(reaction.emoji.name == bot.interface.pause) return emitter.emit('pause-stream', reaction.message)
                if(reaction.emoji.name == bot.interface.stop) return emitter.emit('stop-stream', reaction.message)
                if(reaction.emoji.name == bot.interface.loop) {
                    reaction.message.channel.send(successEmbed('Loop enabled'))
                    return emitter.emit('loop-stream', reaction.message)
                }
            }
        })
        
        emitter.on('queue-stream', (msg: Message, data: string) => {
            //Dynamic Varibales
            const channel = msg.member!.voice.channel
            this.currentChannel = channel

            if(data == "") return msg.channel.send(errorEmbed('Enter a valid Text/URL'))
            if(!channel) return msg.channel.send(errorEmbed('You are not in a Channel.'))
            channel!.join().then(async(connection: VoiceConnection) => {
                this.channelConnection = connection
                if(validateURL(data)) {

                    //Youtube Link/URL
                    const url = data.replace(' ', '')
                    const audio = this.fetchAudioFile(url)
                    const dispatcher = connection.play(audio)
                    this.Dispatcher = dispatcher
                    await ytdl.getInfo(url).then((info: videoInfo) => this.currentSong = { title: info.videoDetails.title, url: url, thumbnail: info.videoDetails.thumbnails[0].url })
                    this.StateManager()
                } else {

                    //Youtube Search
                    const { videos } = await yts(data).catch((err: any) => { throw err })
                    if(!videos.length) return msg.channel.send(errorEmbed('Song not found.'))
                    this.currentSong = { title: videos[0].title, url: videos[0].url, thumbnail: videos[0].thumbnail }
                    const audio = this.fetchAudioFile(videos[0].url)
                    const dispatcher = await connection.play(audio)
                    this.Dispatcher = dispatcher
                    this.StateManager()
                }

                //Sending Controll Embed and assigne Variable
                const Embed = await this.ControllEmbed(msg)
                this.reactionEmbed = Embed
            }).catch(err => console.log(err))
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