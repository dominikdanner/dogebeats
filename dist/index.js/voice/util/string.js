"use strict";
exports.__esModule = true;
exports.getArgsString = exports.getArgs = void 0;
/**
 * @returns String
 */
function getArgsString(content) {
    var arr = content.split(' ');
    arr.shift();
    return arr.toString().replace(/,/g, ' ');
}
exports.getArgsString = getArgsString;
/**
 * @returns Array
 */
function getArgs(msg) {
    var content = msg.content;
    var args = content.split(' ');
    args.shift();
    return args;
}
exports.getArgs = getArgs;
