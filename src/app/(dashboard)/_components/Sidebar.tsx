"use client";

import UserProfile from "~/components/user-profile";
import clsx from "clsx";
import {
  type LucideIcon,
  BarChart,
  Settings,
  Bell,
  UserIcon,
  ListTodo,
  TargetIcon,
  TreeDeciduousIcon,
  Flame,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart,
  },
  // {
  //   label: "Accountablity",
  //   href: "/accountability",
  //   icon: BicepsFlexed,
  // },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
   {
    label: "Habits",
    href: "/habits",
    icon: TreeDeciduousIcon,
  },
   {
    label: "Weekly Goals",
    href: "/weekly-goals",
    icon: TargetIcon,
  },
   {
    label: "Goals",
    href: "/goals",
    icon: Flame,
  },
];

export default function DashboardSideBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-[1024px]:block hidden group w-18 hover:w-64 border-r h-full bg-background transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        {/*  */}


     


        <nav className="flex flex-col h-full justify-between items-start w-full space-y-1">
          {/* Main Navigation */}
          <div className="w-full space-y-1 p-4">
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => router.push(item.href)}
                className={clsx(
                  "flex items-center group-hover:justify-start gap-3 w-full rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all hover:cursor-pointer whitespace-nowrap overflow-hidden",
                  pathname === item.href
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5  shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-2 w-full">
            <div className="px-4">
              <div
                onClick={() => router.push("/settings")}
                className={clsx(
                  "flex items-center group-hover:justify-start w-full gap-3 rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all hover:cursor-pointer whitespace-nowrap overflow-hidden",
                  pathname === "/settings"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Bell className="h-5 w-5 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Notifications
                </span>
              </div>
              <div
                onClick={() => router.push("/settings")}
                className={clsx(
                  "flex items-center group-hover:justify-start w-full gap-3 rounded-lg px-2.5 group-hover:px-3 py-2 text-sm font-medium transition-all hover:cursor-pointer whitespace-nowrap overflow-hidden",
                  pathname === "/settings"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Settings className="h-5 w-5 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Settings
                </span>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <UserProfile/>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}