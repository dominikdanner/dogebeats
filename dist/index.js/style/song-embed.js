"use strict";
exports.__esModule = true;
exports.infoEmbed = void 0;
var discord_js_1 = require("discord.js");
var infoEmbed = function (msg, title, author, thumbnail) {
    var AuthorURL = msg.author.avatarURL();
    return new discord_js_1.MessageEmbed().setColor('#009ACD')
        .addFields({ name: 'Added to queue:', value: title }, { name: 'Request made by:', value: author })
        .setThumbnail(thumbnail)
        .setTimestamp()
        .setFooter('Created by Dominik Danner with 🤍', AuthorURL);
};
exports.infoEmbed = infoEmbed;
