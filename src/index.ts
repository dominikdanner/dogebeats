import { Client } from 'discord.js'
import { bot } from './config/config'
import { Clear } from './command/clear'
import { AudioHandler } from './voice/audio'
const client = new Client()
const audioHandler = new AudioHandler(client)

client.on('ready', () => {
    console.log("Logged in")
    client.user?.setPresence(bot.presence)
    
    //Clear Command
    Clear(client, bot.commands.clear.name)

    //Audio-Handler for the music
    audioHandler.start()
})

client.login(bot.BOT_TOKEN)