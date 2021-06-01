import internal from 'stream';

export default class AudioQueue {
    public Queue: internal.Readable[] = [];

    add = (data: internal.Readable) => {
        return this.Queue.push(data)
    }

    remove = (pos: number) => {
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
}