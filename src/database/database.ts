import mongoose, { Document } from 'mongoose'
import color from 'colors'
import { mongo } from '../config/config'
import { emitter } from '../voice/event/voice-emitter';
import { HistorySchema } from './model/History';
import { Message } from 'discord.js';
import { errorEmbed } from '../style/error-embed';
import { successEmbed } from '../style/success-embed';

export const DatabaseLogger = ()  => {
    let skipState: number = 1;
    mongoose.connect(mongo.CONNECTION_STRING, mongo.CONNECTION_OPT)
        .then(_ => console.log(`MognoDB:   ${ color.green('CONNECTED') }`))
        .catch(_ => console.log(`MongoDB:   ${ color.red('NOT CONNECTED') }`));
        
        emitter.on('queue-add', async({ title, url, thumbnail }) => {
            const History: Document  = new HistorySchema({ 
                yt_url: url,
                thumbnail_url: thumbnail,
                title: title,
                timestamp: new Date().toLocaleTimeString()
            })
            await History.save()
                .then(_ => console.log(`MongoDB: ${color.green('SUCCESSFUL')}`))
                .catch(_ => console.log(`MongoDB: ${color.red('ERROR')}`))
        })
    
        emitter.on('history-back', async(msg: Message) => {
            await HistorySchema.collection.countDocuments().then((count: any) => {
                HistorySchema.find().then((res: any) => {
                    skipState++
                    console.log(skipState)
                    msg.channel.send(successEmbed('Skiped Back'))
                    const newUrl = res[count-skipState]['yt_url']
                    emitter.emit('queue-stream', msg, newUrl, false)
                })
            })
        })

        emitter.on('history-foward', async(msg: Message) => {
            await HistorySchema.collection.countDocuments().then((count: any) => {
                HistorySchema.find().then(async(res: any) => {
                    skipState--
                    const newUrl = res[count-skipState]['yt_url']
                    emitter.emit('queue-stream', msg, newUrl, false)
                    msg.channel.send(successEmbed('Skiped Forward'))
                }).catch((_: any) => msg.channel.send(errorEmbed('You cant go more forward.')))
            })
        })
}