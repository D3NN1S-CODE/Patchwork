"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Grid3x3, X, User, Calendar, Maximize2, Info, ArrowLeft } from "lucide-react"
import type { Artwork, Room } from "@/lib/types"
import Link from "next/link"

interface GalleryWalkthroughProps {
  room: Room & { artist: { display_name: string; username: string } }
  artworks: Artwork[]
}

export function GalleryWalkthrough({ room, artworks }: GalleryWalkthroughProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"walkthrough" | "grid">("walkthrough")
  const [showInfo, setShowInfo] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentArtwork = artworks[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "walkthrough") return

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      } else if (e.key === "ArrowRight" && currentIndex < artworks.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo((prev) => !prev)
      } else if (e.key === "g" || e.key === "G") {
        setViewMode("grid")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, artworks.length, viewMode])

  const nextArtwork = () => {
    if (currentIndex < artworks.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevArtwork = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  if (viewMode === "grid") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto p-6 lg:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div className="w-12 h-12 rounded-xl" style={{ background: getCubeColor(room.color_theme) }} />
                <div>
                  <h1 className="text-3xl font-bold">{room.title}</h1>
                  <p className="text-muted-foreground">by {room.artist.display_name}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setViewMode("walkthrough")} variant="outline" size="lg">
              Enter Walkthrough Mode
            </Button>
          </div>

          {room.description && (
            <Card className="p-6">
              <p className="text-muted-foreground">{room.description}</p>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork, index) => (
              <Card
                key={artwork.id}
                className="group cursor-pointer overflow-hidden"
                onClick={() => {
                  setCurrentIndex(index)
                  setViewMode("walkthrough")
                }}
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={artwork.image_url || "/placeholder.svg"}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{artwork.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Gallery Corridor Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(to bottom, ${getCubeColor(room.color_theme)}15, transparent 30%, transparent 70%, ${getCubeColor(room.color_theme)}15)`,
        }}
      >
        {/* Perspective corridor effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full max-w-7xl h-[70vh] flex items-center justify-center perspective-corridor"
            style={{
              perspective: "1000px",
            }}
          >
            {/* Main Artwork Display */}
            <div
              className="relative transition-all duration-700 ease-out"
              style={{
                transform: isFullscreen ? "scale(1.2)" : "scale(1)",
              }}
            >
              <img
                src={currentArtwork?.image_url || "/placeholder.svg"}
                alt={currentArtwork?.title || "Artwork"}
                className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg animate-fade-in"
                style={{
                  boxShadow: `0 20px 80px ${getCubeColor(room.color_theme)}50`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Floor reflection effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
          }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <Button
          size="lg"
          variant="secondary"
          onClick={prevArtwork}
          disabled={currentIndex === 0}
          className="h-14 w-14 rounded-full shadow-xl bg-background/80 backdrop-blur-lg hover:bg-background"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="bg-background/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-xl">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {artworks.length}
          </span>
        </div>

        <Button
          size="lg"
          variant="secondary"
          onClick={nextArtwork}
          disabled={currentIndex === artworks.length - 1}
          className="h-14 w-14 rounded-full shadow-xl bg-background/80 backdrop-blur-lg hover:bg-background"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-lg hover:bg-background" asChild>
            <Link href="/">
              <X className="w-5 h-5" />
            </Link>
          </Button>
          <div className="bg-background/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-xl">
            <h2 className="font-semibold text-sm">{room.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-background/80 backdrop-blur-lg hover:bg-background"
          >
            <Info className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-background/80 backdrop-blur-lg hover:bg-background"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className="bg-background/80 backdrop-blur-lg hover:bg-background"
          >
            <Grid3x3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Artwork Info Panel */}
      {showInfo && currentArtwork && (
        <div className="absolute bottom-32 right-6 max-w-md z-50 animate-slide-in-right">
          <Card className="bg-background/90 backdrop-blur-lg border-2 shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{currentArtwork.title}</h3>
              {currentArtwork.description && (
                <p className="text-muted-foreground leading-relaxed">{currentArtwork.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{room.artist.display_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(currentArtwork.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-6 left-6 z-50">
        <Card className="bg-background/80 backdrop-blur-lg px-4 py-2 text-xs text-muted-foreground">
          <span className="font-mono">← →</span> Navigate <span className="mx-2">•</span>
          <span className="font-mono">I</span> Info <span className="mx-2">•</span>
          <span className="font-mono">G</span> Grid View
        </Card>
      </div>
    </div>
  )
}

function getCubeColor(theme: string) {
  const colors: Record<string, string> = {
    blue: "oklch(0.52 0.19 252)",
    red: "oklch(0.59 0.23 25)",
    orange: "oklch(0.62 0.23 28)",
    yellow: "oklch(0.92 0.15 94)",
    green: "oklch(0.54 0.16 145)",
    white: "oklch(0.95 0.01 0)",
  }
  return colors[theme] || colors.blue
}
