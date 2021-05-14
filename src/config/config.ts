import { PresenceData } from 'discord.js'
import { ConnectOptions } from 'mongoose'

export const bot: {
    PREFIX: string,
    presence: PresenceData,
    interface: any,
    commands: any,
    voice: any,
    BOT_TOKEN: string,
} = {
    PREFIX: '/',
    presence: {
        status: 'online',
        activity: {
            type: 'LISTENING',
            name: 'den Schülern'
        }
    },
    //Reaction Interface Emojies
    interface: {
        stop: "🛑",
        loop: "🔁",
        resume: "▶",
        pause: "⏸️",
        forward: "↪️",
        back: "↩️",
    },
    //All Commands and there specific Config
    commands: {
        help: {
            name: ['help', 'hilfe']
        },
        clear: {
            name: ['cc', 'clear', 'clearchannel'],
            //Delay Befor Bulk Deleting Messages in Channel.
            DelayBeforeDelete: 0,
        },
        play: {
            name: 'play'
        },
        pause: {
            name: ['pause', 'stop']
        },
        leave: {
            name: ['leave']
        }
    },
    voice: {
        VOICE_TYPE: 'voice',
        DEFAULT_CHANNEL: '840156612005593138',
    },
    //Bot Token
    BOT_TOKEN: 'ODM5OTE0NzE4NTY2OTQwNjkz.YJQliQ.IwO9SL9ONttdJCV4mBq5pqZrZHo',
}

export const mongo: {
    CONNECTION_STRING: string,
    CONNECTION_OPT: ConnectOptions
} = {
    CONNECTION_STRING: 'mongodb://localhost:27017/music',
    CONNECTION_OPT: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}

export const colors = {
    red: 'eb4034',
}