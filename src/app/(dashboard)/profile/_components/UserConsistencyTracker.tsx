"use client"

import * as React from "react"
import { api } from "~/lib/api"
import { motion } from "motion/react"
import Image from "next/image"
import { Trophy, Flame, TrendingUp, Award } from "lucide-react"

export function UserConsistencyTracker() {
  const { data: completionData } = api.habit.getYearlyCompletionDays.useQuery()
  const { data: leaderboard } = api.user.getLeaderboard.useQuery()
  const { data: user } = api.user.me.useQuery()

  const consistentDays = completionData?.completedDayNumbers.length ?? 0
  
  const rank = React.useMemo(() => {
    if (!leaderboard || !user) return "-"
    const userRank = leaderboard.findIndex((u) => u.id === user.id)
    return userRank !== -1 ? `#${userRank + 1}` : "-"
  }, [leaderboard, user])

  const completionRate = Math.round((consistentDays / 365) * 100)
  const missedRate = 100 - completionRate

  // Determine badge status
  const getBadgeStatus = () => {
    if (completionRate >= 90) return { label: "Legendary", color: "bg-amber-500" }
    if (completionRate >= 75) return { label: "Epic", color: "bg-purple-500" }
    if (completionRate >= 50) return { label: "Rare", color: "bg-blue-500" }
    return { label: "Common", color: "bg-gray-500" }
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[380px] mx-auto"
    >
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/5">
        
        {/* Main Visual Area */}
        <div className="relative h-35 w-full  p-6 flex flex-col items-center">
          

            {/* Main Avatar/Visual */}
            <div className="relative mt-12 w-64 h-64 z-10">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl" />
                
              

                {/* Floating Stats Tag (Price Tag equivalent) */}
                <div className="w-full">
                     <div className="bg-[#1a1d24]/90 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-4 flex items-center justify-between shadow-xl">
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Days</span>
                        <span className="text-white font-bold text-lg flex items-baseline gap-2">
                            {consistentDays}
                            <span className="text-muted-foreground text-sm font-light">
                            /365
                            </span>
                            <span className="text-blue-500 text-xs">DAYS</span>
                        </span>
                     </div>
                </div>
            </div>

            {/* Background Particles/Decor */}
            <div className="absolute top-10 right-10 w-2 h-2 bg-blue-500 rounded-full opacity-50 blur-[1px]" />
            <div className="absolute top-20 left-10 w-1.5 h-1.5 bg-purple-500 rounded-full opacity-40 blur-[1px]" />
            <div className="absolute bottom-32 right-20 w-3 h-3 bg-blue-400 rounded-full opacity-30 blur-[2px]" />
        </div>

        {/* Content Body */}
        <div className="px-6 pb-8 pt-4 bg-[#0F1115]">
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{user?.name ?? "User"}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-wider">
                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                        <Flame className="w-3 h-3 text-orange-500" />
                    </div>
                    <span>Consistency Tracker</span>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-[#15181E] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-xs font-medium mb-1">Global Rank</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-white font-bold text-xl">{rank}</span>
                            {rank !== "-" && <span className="text-green-500 text-xs flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> Top 5%</span>}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <span className="text-gray-500 text-xs font-medium mb-1">Distribution %</span>
                         <div className="flex items-center gap-3 text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-white">{completionRate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                                <span className="text-gray-500">{missedRate}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${completionRate}%` }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <div style={{ width: `${missedRate}%` }} className="h-full bg-purple-900/30" />
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  )
}
