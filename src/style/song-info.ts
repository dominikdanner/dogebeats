import { MessageEmbed, Message } from 'discord.js'

export const infoEmbed = (msg: Message, title: string, author: string, thumbnail: any) => {
    const AuthorURL: any = msg.author.avatarURL()
    return new MessageEmbed().setColor('#009ACD')
    .addFields({ name: 'Added to queue:', value: title }, { name: 'Request made by:', value: author })
    .setThumbnail(thumbnail)
	.setTimestamp()
	.setFooter('Created by Dominik Danner with 🤍', AuthorURL);
}