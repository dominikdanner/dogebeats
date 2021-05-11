import { Client } from 'discord.js'
import { errorEmbed } from '../style/error-embed'
import { bot } from '../config/config'
import { successEmbed } from '../style/success-embed'

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

export const Clear = (client: any, namespace: string[]) => {
    setCommand(client, namespace, async(msg: any) => {
        if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(errorEmbed('No Permissions to execute.'))
        await msg.channel.messages.fetch().then((results: any) => {
            setTimeout(async() => {
                msg.channel.bulkDelete(results)
                const Message = await msg.channel.send(successEmbed('Loading...'))
                Message.delete({ timeout: 2000 })
            }, bot.commands.clear.DelayBeforeDelete)
        })
    })
}