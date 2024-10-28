import mongoose, { Schema } from 'mongoose';
import  mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';




const videoFileSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
})

const thumbnailSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
})

// create a schema for videos
const videoSchema = new Schema(
    {
        videoFile: {
            type: videoFileSchema,
            required: true
        },
        thumbnail: {
            type: thumbnailSchema,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default:false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }

    },{
        timestamps: true
    }
)

// calculate aggreagte video playback count using mongoose aggregate paginnate
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video', videoSchema)