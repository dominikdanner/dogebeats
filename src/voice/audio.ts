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
    // Status of the audiofile playing
    public isPlaying: boolean;
    // Current song witch is playing
    public currentSong: ISong;

    protected SongState: number = 0;
    // Discord Client
    protected client: Client;
    // Channel Connection
    protected channelConnection: VoiceConnection;
    // If Error happens this will have a value.
    protected AudioStream: internal.Readable
    // Audio Dispatcher with Current Song paired.
    protected Dispatcher: StreamDispatcher | null;
    // Channel you are currently in.
    protected Channel: VoiceChannel | null;
    
    constructor (client: Client) {
        super();
        this.client = client
    }
    
    start = () => {
        
        // Message event
        this.client.on('message', async(msg: Message) => {
            if(msg.content.startsWith(`${bot.PREFIX}${bot.commands.play.name}`)){
                
                // Fetching Audiofile
                await getAudio(getArgsString(msg.content), (err: Error, AudioStream: internal.Readable, Song: ISong) => {
                    // Catching Errors
                    if(err) throw err
                    
                    this.currentSong = Song
                    
                    // Current channel of a User
                    this.Channel = msg.member!.voice.channel
                    
                    // React on message
                    msg.react(bot.interface.true)
                    
                    // When User isn't in a channel
                    if(!this.Channel) return msg!.channel.send(errorEmbed('You are not in a Channel.'))
                    
                    this.Channel.join().then(async(connection: VoiceConnection) => {
                        this.channelConnection = connection
                        
                        // Adding Song to internal.Readable Array
                        Queue.add(AudioStream)
                        if(!this.isPlaying) {
                            this.Dispatcher = this.channelConnection.play(Queue.get(0))
                            this.isPlaying = true
                            this.Dispatcher.once('finish', () => {
                                this.isPlaying = false
                                console.log("Finish")
                            })
                        }
                    }).catch(err => console.log(err))
                })
            }
            
            // Skip in Queue to the next element
            else if(msg.content.startsWith(`${bot.PREFIX}skip`)) {
                
                // Checks if there is a song skipable
                if(Queue.getLenght() <= 1)
                    return msg.channel.send(errorEmbed('No Songs to skip'))

                this.Dispatcher?.emit('finish')
                Queue.remove(0)
                this.Dispatcher = this.channelConnection.play(Queue.get(0))
                this.isPlaying = true
                this.Dispatcher.once('finish', () => {
                    this.isPlaying = false
                    console.log("Finish")
                })
            }
            
            // Command for Stopping Dispatcher
            else if(msg.content.startsWith(`${bot.PREFIX}stop`)) {
                if(this.isPlaying) {
                    Queue.clear()
                    this.Dispatcher?.pause()
                    this.Dispatcher?.emit('finish')
                    return this.Dispatcher = null
                }
            }
        })
    }
}