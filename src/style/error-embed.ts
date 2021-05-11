import { MessageEmbed } from 'discord.js'

export const errorEmbed = (msg: string) => {
    return new MessageEmbed().setColor('#FF0000').setDescription('❌ | ' + msg)
}