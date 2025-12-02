// import { headers } from "next/headers"
// import { redirect } from "next/navigation"
// import { AppSidebar } from "~/components/app-sidebar"

import DashboardSideBar from "./_components/Sidebar";

// import { SiteHeader } from "~/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "~/components/ui/sidebar"
// import { auth } from "~/lib/auth"
// import { getUserSubscriptionStatus } from "~/lib/subscription"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    //   const session = await auth.api.getSession({
    //     headers:await headers()
    //   })
    
    //   if(!session) {
    //         redirect("/")
    //     }
      
        // // const subscriptionStatus = await getUserSubscriptionStatus()
        // const username = session.user.name
        // const email = session.user.email
        // const avatar = session.user.image ?? ""

  return (
   <>
    <div className="flex h-screen overflow-hidden w-full">
      <DashboardSideBar />
      <main className="flex-1 overflow-y-auto">
          {children}
      </main>
    </div>
   </>
  )
}