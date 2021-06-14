import { Message } from "discord.js";

/**
 * @returns String
 */
function getArgsString(content: string): string {
    const arr = content.split(' ')
    arr.shift();
    return arr.toString().replace (/,/g, ' ');
}

/**
 * @returns Array
 */
function getArgs(msg: Message): string[] {
    const { content } = msg
    let args = content.split(' ')
    args.shift()
    return args
}

export { getArgs, getArgsString }
    