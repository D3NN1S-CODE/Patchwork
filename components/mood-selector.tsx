"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const moods = [
  { name: "Calm", color: "bg-blue-500", glow: "shadow-blue-500/50", emoji: "🌊" },
  { name: "Energetic", color: "bg-red-500", glow: "shadow-red-500/50", emoji: "⚡" },
  { name: "Lifting", color: "bg-yellow-500", glow: "shadow-yellow-500/50", emoji: "☀️" },
  { name: "Studious", color: "bg-green-500", glow: "shadow-green-500/50", emoji: "📚" },
  { name: "Dreamy", color: "bg-purple-500", glow: "shadow-purple-500/50", emoji: "✨" },
]

export function MoodSelector({ userId }: { userId: string }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)
  const router = useRouter()

  const handleMoodSelect = (moodName: string) => {
    setSelectedMood(moodName)
    // Navigate to mood playlist or trigger music recommendations
    router.push(`/app/mood/${moodName.toLowerCase()}`)
  }

  return (
    <Card className="p-8 lg:p-12 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Glowing Orb */}
        <div className="relative">
          <div
            className={`w-48 h-48 rounded-full transition-all duration-500 ${
              hoveredMood
                ? moods.find((m) => m.name === hoveredMood)?.color
                : selectedMood
                  ? moods.find((m) => m.name === selectedMood)?.color
                  : "bg-gradient-to-br from-primary to-accent"
            } animate-glow-pulse shadow-2xl ${
              hoveredMood
                ? moods.find((m) => m.name === hoveredMood)?.glow
                : selectedMood
                  ? moods.find((m) => m.name === selectedMood)?.glow
                  : "shadow-primary/50"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              {hoveredMood
                ? moods.find((m) => m.name === hoveredMood)?.emoji
                : selectedMood
                  ? moods.find((m) => m.name === selectedMood)?.emoji
                  : "🎵"}
            </div>
          </div>

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          <div
            className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{hoveredMood || selectedMood || "Select Your Mood"}</p>
          <p className="text-muted-foreground mt-2">Choose how you're feeling to discover perfect soundtracks</p>
        </div>

        {/* Mood Options */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-4xl">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              onMouseEnter={() => setHoveredMood(mood.name)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`flex flex-col items-center gap-4 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedMood === mood.name
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full ${mood.color} animate-glow-pulse flex items-center justify-center text-2xl`}
              >
                {mood.emoji}
              </div>
              <span className="text-lg font-medium text-foreground">{mood.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
