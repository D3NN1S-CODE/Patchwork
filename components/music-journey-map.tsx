"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

interface HistoryItem {
  id: string
  mood_tag: string | null
  played_at: string
  song: {
    title: string
    artist_name: string
    mood_tags: string[] | null
  }
}

export function MusicJourneyMap({ history }: { history: HistoryItem[] }) {
  const moodData = useMemo(() => {
    const moodCounts: Record<string, number> = {}
    history.forEach((item) => {
      const mood = item.mood_tag || "unknown"
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })

    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0)
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / total) * 100),
    }))
  }, [history])

  const moodColors: Record<string, string> = {
    calm: "bg-blue-500",
    energetic: "bg-red-500",
    lifting: "bg-yellow-500",
    studious: "bg-green-500",
    dreamy: "bg-purple-500",
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>Your Mood Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Based on your last {history.length} tracks</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 h-12 rounded-full overflow-hidden">
          {moodData.map(({ mood, percentage }) => (
            <div
              key={mood}
              className={`${moodColors[mood] || "bg-muted"} transition-all duration-500 hover:opacity-80`}
              style={{ width: `${percentage}%` }}
              title={`${mood}: ${percentage}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moodData.map(({ mood, count, percentage }) => (
            <div key={mood} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border">
              <div className={`w-12 h-12 rounded-full ${moodColors[mood] || "bg-muted"} animate-glow-pulse`} />
              <div className="text-center">
                <p className="font-semibold capitalize">{mood}</p>
                <p className="text-2xl font-bold text-primary">{percentage}%</p>
                <p className="text-xs text-muted-foreground">{count} plays</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
