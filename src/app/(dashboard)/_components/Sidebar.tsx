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
import { useState } from "react";
import { HabitForm } from "./HabitForm";

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

  const [createHabit, setCreateHabit] = useState(false);

  return (
    <div className="min-[1024px]:block hidden w-64 border-r h-full bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-[3.45rem] items-center border-b px-4 py-8 mx-4">
          <Link
            prefetch={true}
            className="flex items-center font-semibold hover:cursor-pointer"
            href="/"
          >
            <Image
              src="/logo.png"
              alt="PushUp Logo"
              width={32}
              height={32}
              className="mr-2 rounded-md w-10 h-10 drop-shadow-2xl"
            />
            <span className="heading-serif italic text-2xl">PushUp</span>
          </Link>
        </div>

          <div className="mx-auto w-full px-5">
            <HabitForm/>
          </div>

        <nav className="flex flex-col h-full justify-between items-start w-full space-y-1">
          <div className="w-full space-y-1 p-4">
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => router.push(item.href)}
                className={clsx(
                  "flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:cursor-pointer",
                  pathname === item.href
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="px-4">
              <div
                onClick={() => router.push("/settings")}
                className={clsx(
                  "flex items-center w-full gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:cursor-pointer",
                  pathname === "/settings"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </div>
            </div>
            <UserProfile />
          </div>
        </nav>
      </div>
    </div>
  );
}