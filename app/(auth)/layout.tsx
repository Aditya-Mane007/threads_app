import "../globals.css"
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Application"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#877EFF",
          colorText: "white"
        },
        elements: {
          formButtonPrimary: {
            fontSize: 14
          }
        },
        layout: {
          helpPageUrl: "https://clerk.com/support",
          logoImageUrl: "https://clerk.com/logo.png",
          logoPlacement: "inside",
          privacyPageUrl: "https://clerk.com/privacy",
          showOptionalFields: true,
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          termsPageUrl: "https://clerk.com/terms"
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full flex justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
