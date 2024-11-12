import { isValidObjectId } from "mongoose"
import { Like } from "../models/like.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
     if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    
    const liked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })
    if (liked) {
        await Like.findByIdAndDelete(liked._id)
        
        return res
            .status(200)
            .json(new ApiResponse(200, {liked: false}))
    }

    await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { liked: true }))
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const liked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    })
    if (liked) {
        await Like.findByIdAndDelete(likedAlready?._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }))
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user?._id,
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }))

})

const togglePostLike = asyncHandler(async (req, res) => {
    const { postId } = req.params
    if(!isValidObjectId(postId)) {
        throw new ApiError(400, "Invalid post id")
    }

    const liked = await Like.findOne({
        post: postId,
        likedBy: req.user?._id
    })
    if (liked) {
        await Like.findByIdAndDelete(liked?._id)

        return res
            .status(200)
            .json(new ApiResponse(200, { liked: false }))
    }

    await Like.create({
        post: postId,
        likedBy: req.user?._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: mongoose.Types.ObjectId(req.user?._id)
            }
        }, {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    }, {
                        $unwind: "$ownerDetails"
                    }
                ]            
            }
        }, {
            $unwind: "$likedVideos"
        }, {
            $sort: {
              createdAt: -1  
            }
        }, {
            $project: {
                _id: 0,
                likedVideos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    description: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1
                    }
                }
            }
        }
    ])

    return res
        .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked Videos fetched successfully"))
})

export {
    toggleCommentLike,
    togglePostLike,
    toggleVideoLike,
    getLikedVideos
}