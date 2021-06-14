"use strict";
exports.__esModule = true;
exports.errorEmbed = void 0;
var discord_js_1 = require("discord.js");
var errorEmbed = function (msg) {
    return new discord_js_1.MessageEmbed().setColor('#FF0000').setDescription('❌ | ' + msg);
};
exports.errorEmbed = errorEmbed;
