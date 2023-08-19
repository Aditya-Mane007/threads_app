import * as z from "zod"

export const ThreadValidtion = z.object({
  thread: z.string().nonempty().min(3, { message: "MINIMUM 3 CHARACTERS" }),
  accountId: z.string().nonempty()
})

export const CommentValidtion = z.object({
  thread: z.string().nonempty().min(3, { message: "MINIMUM 3 CHARACTERS" })
})
