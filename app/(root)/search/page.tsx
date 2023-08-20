import UserCard from "@/components/cards/UserCard"
import Searchbar from "@/components/shared/Searchbar"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const Page = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect("/onboarding")

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className="head-text mb-10">
        <Searchbar routeType="search" />
        <div className="mt-14 flex flex-col gap-9">
          {result?.users?.length === 0 ? (
            <p className="no-result">No Users</p>
          ) : (
            <>
              {result?.users?.map((userData) => (
                <UserCard
                  key={userData.id}
                  id={userData.id}
                  name={userData.name}
                  username={userData.username}
                  imgUrl={userData.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>
      </h1>
    </section>
  )
}

export default Page
