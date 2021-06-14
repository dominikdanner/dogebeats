"use strict";
exports.__esModule = true;
exports.setCommand = void 0;
var config_1 = require("../config/config");
var setCommand = function (client, aliases, callback) {
    if (typeof aliases === 'string')
        aliases = [aliases];
    client.on('message', function (message) {
        var content = message.content;
        aliases.forEach(function (alias) {
            var command = "" + config_1.bot.PREFIX + alias;
            if (content.startsWith(command + " ") || content === command) {
                callback(message);
            }
        });
    });
};
exports.setCommand = setCommand;
