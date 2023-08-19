import UserCard from "@/components/cards/UserCard"
import ProfileHeader from "@/components/shared/ProfileHeader"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { profileTabs } from "@/constants"
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page = async () => {
  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect("/onboarding")

  // GetActivity
  const activity = await getActivity(userInfo._id)

  return (
    <section className="mt-10 flex flex-col gap-5">
      {activity?.length !== 0 ? (
        activity?.map((act) => (
          <Link key={act._id} href={`/thread/${act.parentId}`}>
            <article className="activity-card">
              <Image
                src={act.author.image}
                alt="person"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
              <p className="!text-small-regular text-light-1">
                <span className="mr-1 text-primary-500">{act.author.name}</span>{" "}
                replied to your thread
              </p>
            </article>
          </Link>
        ))
      ) : (
        <p className="!text-base-regular text-light-3">No activity yet</p>
      )}
    </section>
  )
}

export default Page
