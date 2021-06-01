import { Client } from 'discord.js'
import { bot } from '../config/config'

export const setCommand =  (client: Client, aliases: string[], callback: any) => {
    if (typeof aliases === 'string') aliases = [aliases]
    client.on('message', message => {
        const { content } = message
        aliases.forEach(alias => {
            const command = `${ bot.PREFIX }${ alias }`
            if (content.startsWith(`${ command } `) || content === command) {
                callback(message)
            }
        })
    })
}