"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from "lucide-react"

export function MusicPlayer({ userId }: { userId: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [progress, setProgress] = useState([30])

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Current Song Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
              🎵
            </div>
            <div>
              <p className="font-semibold text-foreground">Select a mood to start</p>
              <p className="text-sm text-muted-foreground">CALLIOPE</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="icon"
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 animate-glow-pulse"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground">0:00</span>
              <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1" />
              <span className="text-xs text-muted-foreground">0:00</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 justify-end">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-32" />
          </div>
        </div>
      </div>
    </Card>
  )
}
