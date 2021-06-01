import internal from 'stream'
import { bot } from '../config/config'
import { Client, Message, StreamDispatcher, VoiceChannel, VoiceConnection } from 'discord.js';
import { getAudio } from './util/youtube'
import { getArgsString } from './util/string'
import { errorEmbed } from '../style/error-embed'
import { EventEmitter } from 'events'
import AudioQueue from './queue/audioQueue'
import { ISong } from '../interface/Song';
const Queue = new AudioQueue()

export class AudioHandler extends EventEmitter{
    //Status of the audiofile playing
    public isPlaying: boolean;
    public currentSong: ISong;
    //Current song witch is playing
    public controllerEmbed: any;

    protected SongState: number = 0;
    //Discord Client
    protected client: Client;
    //Channel Connection
    protected channelConnection: VoiceConnection;
    //If Error happens this will have a value.
    protected AudioStream: internal.Readable
    //Audio Dispatcher with Current Song paired.
    protected Dispatcher: StreamDispatcher | null;
    //Channel you are currently in.
    protected Channel: VoiceChannel | null;
    
    constructor (client: Client) {
        super();
        this.client = client
    }

    start = () => {
        /**
         * All Textbased Commands
         */
        this.client.on('message', async(msg: Message) => {
            if(msg.content.startsWith(`${bot.PREFIX}${bot.commands.play.name}`)){
                await getAudio(getArgsString(msg, `${ bot.PREFIX }${bot.commands.play.name}`), (_err: Error, AudioStream: internal.Readable, Song: ISong) => {
                    this.currentSong = Song
                    msg.react(bot.interface.true)
                    
                    if(_err) throw _err
                    //Dynamic Varibales
                    this.Channel = msg.member!.voice.channel
                    
                    if(!this.Channel) return msg!.channel.send(errorEmbed('You are not in a Channel.'))
                    
                    this.Channel.join().then(async(connection: VoiceConnection) => {
                        this.channelConnection = connection
                        if(this.isPlaying) {
                            Queue.add(AudioStream)
                            return console.log("All Songs: " + Queue.getLenght())
                        } else {               
                            //Plays the Stream in Discord Channel
                            Queue.add(AudioStream)
                            this.Dispatcher = await connection.play(AudioStream)
                            this.isPlaying = true
                            return console.log("Added Lenght: " + Queue.getLenght())
                        }
                    })
                })
            }
            // Skip in Queue to the next element
            else if(msg.content.startsWith(`${bot.PREFIX}skip`)) {
                if(Queue.getLenght() == 1)
                    return msg.channel.send(errorEmbed('No Songs to skip'))
                else
                    Queue.remove(0)
                    console.log("Skiped Lenght: " + Queue.getLenght())
                    this.Dispatcher = this.channelConnection.play(Queue.get(0))
            } 
            // Command for Stopping Dispatcher
            else if(msg.content.startsWith(`${bot.PREFIX}stop`)) {
                if(this.isPlaying) {
                    this.Dispatcher?.pause()
                    Queue.getAll().splice(0, Queue.getLenght())
                    this.isPlaying = false
                    this.Dispatcher = null
                }
            }
        })
    }
}