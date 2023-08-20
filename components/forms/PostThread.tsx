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
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePathname, useRouter } from "next/navigation"
import { ThreadValidtion } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thread.actions"
import { useOrganization } from "@clerk/nextjs"

interface Props {
  userId: string
}

function PostThread({ userId }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { organization } = useOrganization()

  console.log(organization?.id)

  const form = useForm<z.infer<typeof ThreadValidtion>>({
    resolver: zodResolver(ThreadValidtion),
    defaultValues: {
      thread: "",
      accountId: userId
    }
  })

  const onSubmit = async (values: z.infer<typeof ThreadValidtion>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname
    })

    router.push("/")
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex  flex-col items-center gap-3  w-full">
              <FormLabel className="text-semibold text-light-2 w-full">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={10}
                  {...field}
                  className="account-form_input no-focus"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  )
}

export default PostThread
// function createThred() {
//   throw new Error("Function not implemented.")
// }
