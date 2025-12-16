"use client";

import clsx from "clsx";
import {
  HomeIcon,
  BarChart,
  BicepsFlexed,
  MoreHorizontal,
  Settings,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import * as React from "react";
import { MobileHabitForm } from "./MobileHabitFormDialogButton";
import UserProfile from "~/components/user-profile";

const navItems = [
  {
    label: "Today",
    href: "/profile",
    icon: HomeIcon,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart,
  },
  {
    label: "Accountability",
    href: "/accountability",
    icon: BicepsFlexed,
  },
];

const moreMenuItems = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "View your notifications",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);

  const handleMoreItemClick = (href: string) => {
    setIsMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      <div className="min-[1024px]:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="relative flex items-center justify-around h-16 px-2">
          {/* First two nav items */}
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Center FAB placeholder - creates space for the floating button */}
          <div className="w-16 shrink-0" />

          {/* Third nav item */}
          {navItems[2] && (() => {
            const ThirdIcon = navItems[2].icon;
            return (
              <Link
                href={navItems[2].href}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                  pathname === navItems[2].href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ThirdIcon className="h-5 w-5" />
                <span className="text-xs font-medium">{navItems[2].label}</span>
              </Link>
            );
          })()}

          {/* More menu */}
          <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger asChild>
              <button
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>More Options</SheetTitle>
                <SheetDescription>
                  Access your profile, notifications, and settings
                </SheetDescription>
              </SheetHeader>
              
              {/* User Profile Section */}
              <div className="py-4 border-b">
                <UserProfile showName={true} />
              </div>

              {/* Menu Items */}
              <div className="grid gap-2 py-4">
                {moreMenuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleMoreItemClick(item.href)}
                    className={clsx(
                      "flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-muted",
                      pathname === item.href && "bg-primary/10"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex items-center justify-center w-10 h-10 rounded-full",
                        pathname === item.href
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Floating Action Button */}
          <MobileHabitForm />
        </div>
      </div>
      {/* Bottom padding to prevent content from being hidden behind the nav */}
      <div className="min-[1024px]:hidden h-16" />
    </>
  );
}
