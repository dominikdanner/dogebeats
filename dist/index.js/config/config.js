"use strict";
exports.__esModule = true;
exports.colors = exports.bot = void 0;
exports.bot = {
    PREFIX: '!',
    presence: {
        status: 'online',
        activity: {
            type: 'LISTENING',
            name: 'den Schülern'
        }
    },
    //Reaction Interface Emojies
    interface: {
        "true": "✅",
        stop: "🛑",
        loop: "🔁",
        resume: "▶",
        pause: "⏸️",
        forward: "↪️",
        back: "↩️"
    },
    //All Commands and there specific Config
    commands: {
        help: {
            name: ['help', 'hilfe']
        },
        clear: {
            name: ['cc', 'clear', 'clearchannel'],
            //Delay Befor Bulk Deleting Messages in Channel.
            DelayBeforeDelete: 0
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
    //Bot Token
    BOT_TOKEN: 'ODQwMjI0NTQzMDU4NDI3OTE0.YJVGFQ.OSQu7tbSZ3IWKt7v0pGNsEIJLKg'
};
exports.colors = {
    red: 'eb4034'
};
