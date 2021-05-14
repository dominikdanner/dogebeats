import { Collection } from 'discord.js'
import { bot } from '../config/config'
const VoiceCollection = new Collection()

export const TempChannel = (client: any) => {
    client.on('voiceStateUpdate', async (oldState: any, newState: any) => {
        const user = await client.users.fetch(newState.id)
        const member = newState.guild.member(user)

        if (!oldState.channel && newState.channel.id === bot.voice.DEFAULT_CHANNEL) {
            const channel = await newState.guild.channels.create(`🔗 | ${user.tag}`, {
                    type: bot.voice.VOICE_TYPE,
                    parent: newState.channel.parent
            })
            member.voice.setChannel(channel)
            VoiceCollection.set(user.id, channel.id)
        } else if (oldState.channelID === VoiceCollection.get(newState.id) && oldState.channel.members.size <= 0) {
            return oldState.channel. delete();   
        }
    });
}