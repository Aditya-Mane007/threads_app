"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePathname, useRouter } from "next/navigation"
import { CommentValidtion } from "@/lib/validations/thread"
import Image from "next/image"
import { addCommentToThread } from "@/lib/actions/thread.actions"

// import { createThread } from "@/lib/actions/thread.actions"

interface Props {
  threadId: string
  currentUserImg: string
  currentUserId: string
}

const Comment = ({ threadId, currentUserId, currentUserImg }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(CommentValidtion),
    defaultValues: {
      thread: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof CommentValidtion>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    )

    form.reset()
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Input
                  type="text"
                  placeholder="Comment..."
                  {...field}
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500  comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment
