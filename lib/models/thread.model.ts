import mongoose, { mongo } from "mongoose"

const threadSchems = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    communtiy: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    parentId: {
      type: String
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread"
      }
    ]
  },
  {
    timestamps: true
  }
)

const Thread = mongoose.models?.Thread || mongoose.model("Thread", threadSchems)

export default Thread
