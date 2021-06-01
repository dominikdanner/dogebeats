import { Message } from "discord.js";

/**
 * @returns String
 */
function getArgsString(msg: Message, remove: string) {
    const { content } = msg
    return content.replace(remove, '')
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
    