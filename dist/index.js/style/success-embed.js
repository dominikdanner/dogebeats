"use strict";
exports.__esModule = true;
exports.successEmbed = void 0;
var discord_js_1 = require("discord.js");
var successEmbed = function (msg) {
    return new discord_js_1.MessageEmbed().setColor('#9ACD32').setDescription('✔️ | ' + msg);
};
exports.successEmbed = successEmbed;
