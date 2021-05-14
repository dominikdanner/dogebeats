import color from 'colors'
import { Client } from 'discord.js'
import { bot } from './config/config'
import { Clear } from './command/command'
import { TempChannel } from './voice/temp-channel'
import { MusicPlayer } from './voice/audio-handler'
import { DatabaseLogger } from './database/database'
const client = new Client()
const audio = new MusicPlayer(client)

client.on('ready', async() => {
    console.log(`--------- ${color.grey('General Info')} ---------`)
    console.log(`Login:     ${ color.green(client.user!.tag) }`)
    await DatabaseLogger();
    client.user?.setPresence(bot.presence)
    
    //Clear Command
    Clear(client, bot.commands.clear.name)
    //Creates Dynamic or Temp Channel
    TempChannel(client)
    //Audio-Handler for the music
    audio.MusicPlayer()
})



client.login(bot.BOT_TOKEN)