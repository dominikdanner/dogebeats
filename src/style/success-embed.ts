import { MessageEmbed } from 'discord.js'

export const successEmbed = (msg: string) => {
    return new MessageEmbed().setColor('#9ACD32').setDescription('✔️ | ' + msg)
}