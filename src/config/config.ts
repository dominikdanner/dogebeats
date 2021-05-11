export const bot = {
    PREFIX: '/',
    interface: {
        stop: "🛑",
        loop: "🔁",
        resume: "▶",
        pause: "⏸️",
        forward: "↪️",
        back: "↩️",
    },
    commands: {
        help: {
            name: ['help', 'hilfe']
        },
        clear: {
            name: ['cc', 'clear', 'clearchannel'],
            /**Message Delay in Miliseconds */
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
    BOT_TOKEN: 'ODM5OTE0NzE4NTY2OTQwNjkz.YJQliQ.WKDuMw0U7zzNo956Q4gyJrrWk8M',
}

export const colors = {
    red: 'eb4034',
}