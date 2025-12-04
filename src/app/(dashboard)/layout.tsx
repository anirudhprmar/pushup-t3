import DashboardSideBar from "./_components/Sidebar";
import MobileBottomNav from "./_components/MobileBottomNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    
  return (
   <>
    <div className="flex h-screen overflow-hidden w-full">
      <DashboardSideBar />
      <main className="flex-1 overflow-y-auto pb-20 min-[1024px]:pb-0">
          {children}
      </main>
    </div>
    <MobileBottomNav />
   </>
  )
}