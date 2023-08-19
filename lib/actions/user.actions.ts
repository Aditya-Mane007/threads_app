"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { string } from "zod"
import { FilterQuery, SortOrder } from "mongoose"

export const fetchUser = async (userId: string) => {
  try {
    connectToDB()
    return await User.findOne({ id: userId })
    // .populate({
    //   path: "communities".
    //   ref:"Community"
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user : ${error.message}`)
  }
}

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> => {
  try {
    connectToDB()
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    )

    if (path === "/profile/edit") {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user : ${error.message}`)
  }
}

export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB()
    const threds = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id"
        }
      }
    })

    return threds
  } catch (error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`)
  }
}

interface Parameters {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}

export const fetchUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
}: Parameters) => {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const regx = new RegExp(searchString, "i")

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }

    if (searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regx } }, { name: { $regex: regx } }]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUserCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    const isNext = totalUserCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    console.log(`Unable fetch users/user: ${error.message}`)
  }
}

export const getActivity = async (userId: string) => {
  try {
    connectToDB()

    const userThreads = await Thread.find({ author: userId })

    const childThreads = await userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children)
    }, [])

    const replies = await Thread.find({
      _id: { $in: childThreads },
      author: { $ne: userId }
    }).populate({
      path: "author",
      model: User,
      select: "name image _id"
    })

    return replies
  } catch (error: any) {
    console.log(`Failed to get/fectch actvity: ${error.message}`)
  }
}
