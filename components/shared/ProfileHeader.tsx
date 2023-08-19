"use client"

import { profileTabs } from "@/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import Image from "next/image"

interface Props {
  accountId: string
  authUserId: string
  name: string
  username: string
  imgUrl: string
  bio: string
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio
}: Props) => {
  return (
    <div className="w-full flex flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-20 h-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile-image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-meduim  text-gray-400">@{username}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0 5 w-full bg-dark-3" />
    </div>
  )
}

export default ProfileHeader
