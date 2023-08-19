import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
  mongoose.set("strictQuery", true)
  mongoose.set("strictPopulate", false)

  if (!process.env.MONGO_URL) return console.log("MONGO_URL not found")

  if (isConnected) {
    console.log("MongoDB connected...")
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL)
    isConnected = true
    console.log(`MongoDB connected : ${conn.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}
