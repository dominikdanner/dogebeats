import { EventEmitter } from 'events'
import internal from 'stream';

export default class AudioQueue extends EventEmitter{
    public Queue: internal.Readable[] = [];

    add = (data: internal.Readable) => {
        return this.Queue.push(data)
    }

    remove = (pos: number) => {
        this.emit('remove')
        return this.Queue.splice(pos, 1)
    }

    getAll = () => {
        return this.Queue
    }

    get = (element: number) => {
        return this.Queue[element]
    }

    getLenght = () => {
        return this.Queue.length
    }

    clear = () => {
        return this.Queue.splice(0, this.getLenght())
    }
}