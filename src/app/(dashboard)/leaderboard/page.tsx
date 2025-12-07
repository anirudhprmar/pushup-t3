"use client"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card } from "~/components/ui/card"
import { Flame, Loader2, Crown } from "lucide-react"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import type { RouterOutputs } from "~/trpc/react"

type LeaderboardUser = RouterOutputs["user"]["getLeaderboard"][number]

export default function LeaderboardPage() {
  const { data: leaderboardData, isLoading } = api.user.getLeaderboard.useQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const topThree = leaderboardData?.slice(0, 3) ?? []
  const restOfLeaderboard = leaderboardData?.slice(3) ?? []

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 mx-auto">
        <h1 className="text-6xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent pb-2">
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">
          See who&apos;s staying consistent and crushing their goals. Consistency is key!
        </p>
      </div>

      {/* Podium Section (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
        {/* 2nd Place */}
        {topThree[1] && <PodiumCard user={topThree[1]} place={2} />}
        
        {/* 1st Place */}
        {topThree[0] && <PodiumCard user={topThree[0]} place={1} />}
        
        {/* 3rd Place */}
        {topThree[2] && <PodiumCard user={topThree[2]} place={3} />}
      </div>

      {/* List Section */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between px-6 py-2 text-sm text-muted-foreground font-medium uppercase tracking-wider">
          <div className="w-16 text-center">Rank</div>
          <div className="flex-1">User</div>
          <div className="w-24 text-center hidden md:block">Total Days</div>
         </div>
        
        {restOfLeaderboard.map((user, index) => (
          <LeaderboardRow key={user.id} user={user} rank={index + 4} />
        ))}
      </div>
    </div>
  )
}

function PodiumCard({ user, place }: { user: LeaderboardUser; place: number }) {
  const isFirst = place === 1
  const isSecond = place === 2
  const isThird = place === 3

  let heightClass = "h-auto"
  let avatarSize = "w-20 h-20"
  let crownSize = "w-8 h-8"
  let badgeSize = "w-6 h-6 text-sm"

  if (isFirst) {
    heightClass = "md:-mt-12 md:mb-4 scale-110 z-10"
    avatarSize = "w-28 h-28"
    crownSize = "w-12 h-12"
    badgeSize = "w-8 h-8 text-base"
  } else if (isSecond) {
    heightClass = "md:mt-4"
    avatarSize = "w-20 h-20"
  } else if (isThird) {
    heightClass = "md:mt-8"
    avatarSize = "w-20 h-20"
  }

  return (
    <div className={cn("flex flex-col items-center transition-all duration-300 py-10", heightClass)}>
      <div className="relative mb-2">
        {/* Crown for 1st Place */}
        {isFirst && (
          <div className="absolute -top-8 -rotate-30 left-5 -translate-x-1/2 z-20">
            <Crown className={cn("text-amber-400 fill-amber-400", crownSize)} />
          </div>
        )}

        {/* Avatar with Ring */}
        <div className={cn("rounded-full p-1 bg-linear-to-b from-blue-500 to-blue-700")}>
           <Avatar className={cn("border-4 border-background", avatarSize)}>
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {user.name?.substring(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Rank Badge */}
        <div className={cn(
          "absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold border-4 border-background",
          badgeSize
        )}>
          {place}
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mt-4 space-y-1">
        <h3 className="font-bold text-lg truncate max-w-[150px] text-foreground">{user.name}</h3>
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-medium">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{user.totalConsistentDays} days</span>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({ user, rank }: { user: LeaderboardUser; rank: number }) {
  return (
    <Card className="group hover:bg-secondary/20 transition-colors border-border/50">
      <div className="flex items-center justify-between p-4">
        {/* Rank */}
        <div className="w-16 text-center font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors">
          #{rank}
        </div>

        {/* User Info */}
        <div className="flex-1 flex items-center gap-4">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{user.name}</div>
          </div>
        </div>

        {/* Stats - Desktop */}
        <div className="w-24 text-center hidden md:flex items-center justify-center gap-1 font-medium">
          <Flame className="w-4 h-4 text-orange-500" />
          {user.totalConsistentDays}
        </div>
      </div>
    </Card>
  )
}
