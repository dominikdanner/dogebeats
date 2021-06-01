"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var config_1 = require("./config/config");
var clear_1 = require("./command/clear");
var audio_1 = require("./voice/audio");
var client = new discord_js_1.Client();
var audioHandler = new audio_1.AudioHandler(client);
client.on('ready', function () {
    var _a;
    console.log("Logged in");
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence(config_1.bot.presence);
    //Clear Command
    clear_1.Clear(client, config_1.bot.commands.clear.name);
    //Audio-Handler for the music
    audioHandler.start();
});
client.login(config_1.bot.BOT_TOKEN);
