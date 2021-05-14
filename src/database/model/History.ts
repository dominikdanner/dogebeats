import mongoose, { Schema } from 'mongoose'

const History = new Schema({
    yt_url: {
        required: true,
        type: String,
    },
    thumbnail_url: {
        required: true,
        type: String,
    },
    title: {
        required: true,
        type: String,
    },
    timestamp: {
        required: true,
        type: String,
    }

})

export const HistorySchema = mongoose.model('history', History)
