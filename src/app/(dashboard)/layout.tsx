// import { headers } from "next/headers"
// import { redirect } from "next/navigation"
// import { AppSidebar } from "~/components/app-sidebar"

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
   <div className="flex flex-1 flex-col">
         {children}
    </div>
   </>
  )
}

//   return (
//     <div>
//         <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar variant="inset" username={username} email={email} avatar={avatar} subscriptionStatus={subscriptionStatus} />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//          {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//     </div>
//   )
// }
