"use client";

import UserProfile from "~/components/user-profile";
import clsx from "clsx";
import {
  HomeIcon,
  type LucideIcon,
  BarChart,
  Settings,
  Bell,
  BicepsFlexed,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HabitForm } from "./HabitFormDialogButton";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/home",
    icon: HomeIcon,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart,
  },
  {
    label: "Accountablity",
    href: "/accountability",
    icon: BicepsFlexed,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export default function DashboardSideBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-[1024px]:block hidden group w-18 hover:w-64 border-r h-full bg-background transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-[3.45rem] items-center border-b px-4 py-8 overflow-hidden">
          <Link
            prefetch={true}
            className="flex items-center font-semibold hover:cursor-pointer whitespace-nowrap"
            href="/"
          >
            <Image
              src="https://163jz9wo57.ufs.sh/f/LDDo8gC5wt4WHG96CAWCE8jO4lDAoLUSPrMFKBZibv3dhGsw"
              alt="PushUp Logo"
              width={32}
              height={32}
              className="rounded-md w-10 h-10 drop-shadow-2xl shrink-0"
            />
            <span className="heading-serif italic text-2xl ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              PushUp
            </span>
          </Link>
        </div>


        {/* Habit Form Button - Adapts to sidebar width */}
        <div className="w-full px-4 mt-4 transition-all duration-300">
          <HabitForm />
        </div>


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