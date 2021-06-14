import axios, { AxiosResponse, AxiosError } from "axios"
import ytdl from "ytdl-core"
import { ISong } from '../../interface/Song'


const YoutubeToken = "AIzaSyCKq4UQP9iheNAgb4cZRO4AhF4XcUMpYI8";


/**
 * Calls the Youtube Data API and fetches data for the specific element
 * @param query
 * @callback
 * @async
 */
async function getVideoData(query: string, callback: any) {
    await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=${YoutubeToken}&q=${query}&maxResults=1`)
        .then((response: AxiosResponse) => {
            callback(null, response.data.items[0])
        })
        .catch((err: AxiosError) => callback(err, null))
}

/**
 * Returns Audio Stream as an internal.Readable
 * @param data Could be Youtube URL or a Search Query
 * @async
 */
async function getAudio(query: string, callback: any) {
    console.time('Queue-Time')
    const data = query.trim()
    if(ytdl.validateURL(data)) {
        await ytdl.getBasicInfo(data).then(async(vidData) => {
            const stream = await ytdl(data, { filter: 'audioonly' })
            const song: ISong = { url: data, title: vidData.videoDetails.title, thumbnail: vidData.videoDetails.thumbnails[0].url }
            callback(null, stream, song)
            return console.timeEnd('Queue-Time')
        })
    } else {
        await getVideoData(data, async(err: AxiosError, res: any) => {
            if(err) throw err;
            const id = res.id.videoId
            const stream = await ytdl(`https://www.youtube.com/watch?v=${id}`, { filter: 'audioonly' })
            const song: ISong =  { title: res.snippet.title, url: `https://www.youtube.com/watch?v=${id}`, thumbnail: res.snippet.thumbnails.high.url }
            callback(null, stream, song)
            return console.timeEnd("Queue-Time")
        }).catch(err => callback(err, null, null))
    }
}

export { getVideoData, getAudio }