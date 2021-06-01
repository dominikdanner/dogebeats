import { bot } from "../config/config"
import { errorEmbed } from "../style/error-embed"
import { successEmbed } from "../style/success-embed"
import { setCommand } from "./command"

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