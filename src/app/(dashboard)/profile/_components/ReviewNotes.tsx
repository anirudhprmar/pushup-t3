"use client"

import { api } from "~/lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Quote } from "lucide-react"

export function ReviewNotes() {
  const { data: notes, isLoading } = api.habit.getRecentHabitNotes.useQuery()

  if (isLoading) {
    return (
      <Card className="w-full h-[300px] bg-foreground/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Reflections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <Card className="w-full h-[300px] bg-foreground/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Reflections</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
          <Quote className="w-8 h-8 mb-2 opacity-20" />
          <p>No reflections yet.</p>
          <p className="text-xs">Add notes when completing habits!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[300px] bg-foreground/5 backdrop-blur-sm border-white/10 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Quote className="w-4 h-4 text-blue-400" />
          Recent Reflections
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-full pr-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10">
                    {note.habitName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  &quot;{note.note}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
