"use server"

import { revalidatePath } from "next/cache"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import Community from "../models/community.model"

export const fetchThreads = async (
  pageNumber = 1,
  pageSize = 20
  // userId: string
) => {
  try {
    connectToDB()

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User
      })
      .populate({
        path: "community",
        model: Community
      })
      .populate({
        path: "children", // Populate the children field
        populate: {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id name parentId image" // Select only _id and username fields of the author
        }
      })

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] }
    }) // Get the total count of posts

    const posts = await postsQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length

    return { posts, isNext }
  } catch (error: any) {
    throw new Error(`Failed to fetch/get : ${error.message}`)
  }
}

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}
export const createThread = async ({
  text,
  author,
  communityId,
  path
}: Params) => {
  try {
    connectToDB()
    const createdThread = await Thread.create({
      text,
      author,
      communityId: null
    })

    // // Update user model
    // await User.findByIdAndUpdate(author, {
    //   $push: { threads: createdThread._id }
    // })

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create/post : ${error.message}`)
  }
}

export const fetchThreadById = async (id: string) => {
  connectToDB()
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image"
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image"
          },
          {
            path: "children",
            model: Thread,
            select: "_id id name parentId image"
          }
        ]
      })
      .exec()

    return thread
  } catch (error: any) {
    console.log(`Failed to fetch thread/post: ${error.message}`)
  }
}

export const addCommentToThread = async (
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) => {
  connectToDB()
  try {
    const originalThread = await Thread.findById(threadId)

    if (!originalThread) {
      throw new Error("Thread not found")
    }

    const commentedThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    })

    const savedCommentedThread = await commentedThread.save()

    await originalThread.children.push(savedCommentedThread._id)

    await originalThread.save()

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create/post comment : ${error.message}`)
  }
}
