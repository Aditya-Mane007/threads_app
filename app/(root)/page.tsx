import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"

//app/page.tsx
export default async function Home() {
  const user = await currentUser()

  if (!user) return null

  // const result = await fetchThreads(1, 30, user.id)
  const result = await fetchThreads(1, 30)
  //
  console.log(result?.posts)
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts.length === 0 ? (
          <p className="ro-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
