import { Client } from 'discord.js'
import { bot } from './config/config'
import { Clear } from './command/command'
import { DynamicChannel } from './voice/voice'
import { MusicPlayer } from './voice/audio-handler'
const client = new Client()
const audio = new MusicPlayer(client)

client.on('ready', () => {
    console.log(`Logged in as : ${ client.user?.tag }`)
    client.user?.setPresence({
        status: 'online',
        activity: {
            type: 'LISTENING',
            name: 'den Schülern'
        }
    })
    
    //Clear Command
    Clear(client, bot.commands.clear.name)
    //Creates Dynamic or Temp Channel
    DynamicChannel(client)
    //Audio-Handler for the music
    audio.MusicPlayer()
})



client.login(bot.BOT_TOKEN)