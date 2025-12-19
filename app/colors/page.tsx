"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shirt, ArrowLeft, Palette, Heart } from "lucide-react"
import Image from "next/image"

export default function ColorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedPalette, setSelectedPalette] = useState<string>("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [images, setImages] = useState<any[]>([])
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    if (!currentUser.id) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setSelectedPalette(currentUser.colorProfile?.selectedPalette || "")
    setFavorites(currentUser.colorProfile?.favorites || [])
  }, [router])

  if (!user) return null

  const handleSelectPalette = async (paletteName: string) => {
    setSelectedPalette(paletteName)
    setLoadingImages(true)

    try {
      const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
      currentUser.colorProfile = {
        selectedPalette: paletteName,
        favorites: favorites,
      }
      localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))

      // Fetch images based on palette vibe
      const paletteVibe: Record<string, string> = {
        "Warm Autumn": "warm earth tones autumn outfit",
        "Cool Summer": "cool soft pastel summer outfit",
        "Bright Spring": "bright vibrant spring outfit",
        "Deep Winter": "bold deep winter outfit",
        "Soft Autumn": "soft muted autumn outfit",
        "Clear Winter": "clear bright winter outfit",
      }

      const params = new URLSearchParams()
      if (paletteVibe[paletteName]) params.set("style", paletteVibe[paletteName])
      params.set("limit", "12")

      const res = await fetch(`/api/images?${params.toString()}`)
      const data = await res.json()
      setImages((data.images || []).slice(0, 6))
    } catch (e) {
      console.error("Failed to load palette images", e)
      setImages([])
    } finally {
      setLoadingImages(false)
    }
  }

  const handleToggleFavorite = (paletteName: string) => {
    const updated = favorites.includes(paletteName)
      ? favorites.filter((f) => f !== paletteName)
      : [...favorites, paletteName]
    setFavorites(updated)

    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    currentUser.colorProfile = {
      selectedPalette: selectedPalette,
      favorites: updated,
    }
    localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))
  }

  const colorPalettes = [
    {
      name: "Warm Autumn",
      colors: ["#D2691E", "#CD853F", "#DEB887", "#F4A460", "#DAA520"],
      description: "Rich, earthy tones that complement warm skin undertones",
    },
    {
      name: "Cool Summer",
      colors: ["#4682B4", "#87CEEB", "#B0C4DE", "#ADD8E6", "#E0FFFF"],
      description: "Soft, muted colors perfect for cool undertones",
    },
    {
      name: "Bright Spring",
      colors: ["#FF69B4", "#FFD700", "#7FFF00", "#FF6347", "#00CED1"],
      description: "Vibrant, clear colors for warm, bright complexions",
    },
    {
      name: "Deep Winter",
      colors: ["#000080", "#8B0000", "#2F4F4F", "#800080", "#FFFFFF"],
      description: "Bold, saturated colors for cool, high-contrast coloring",
    },
    {
      name: "Soft Autumn",
      colors: ["#BC8F8F", "#F0E68C", "#BDB76B", "#D2B48C", "#CD5C5C"],
      description: "Muted, warm colors with a soft appearance",
    },
    {
      name: "Clear Winter",
      colors: ["#FF1493", "#0000FF", "#00FF00", "#FFFF00", "#FF00FF"],
      description: "Bright, clear colors with high saturation",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh">
      <nav className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
              PATCHWORK
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 border border-primary/30 text-primary text-sm font-medium">
              <Palette className="w-4 h-4" />
              Color Analysis
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">Your Color Palettes</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover which color families complement your unique features and enhance your natural beauty
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {colorPalettes.map((palette, index) => (
              <Card
                key={palette.name}
                className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-serif font-semibold">{palette.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={favorites.includes(palette.name) ? "text-primary" : "text-muted-foreground hover:text-primary"}
                    onClick={() => handleToggleFavorite(palette.name)}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(palette.name) ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex gap-2 mb-4">
                  {palette.colors.map((color) => (
                    <div
                      key={color}
                      className="flex-1 h-24 rounded-lg shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{palette.description}</p>

                <Button
                  className={`w-full mt-4 ${selectedPalette === palette.name ? "bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white" : "bg-transparent"}`}
                  variant={selectedPalette === palette.name ? "default" : "outline"}
                  onClick={() => handleSelectPalette(palette.name)}
                >
                  {selectedPalette === palette.name ? "✓ Selected" : "Try This Palette"}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="mt-12 p-8 bg-gradient-to-br from-accent/10 via-primary/10 to-[var(--fashion-red)]/10 border-2 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-semibold">Understanding Your Colors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Color analysis is based on your skin's undertones, hair color, and eye color. Wearing colors from your
                  ideal palette can make you look more vibrant, rested, and polished. Colors outside your palette might
                  make you appear washed out or tired. Experiment with different palettes to find what makes you feel
                  most confident!
                </p>
              </div>
            </div>
          </Card>

          {selectedPalette && (
            <div className="mt-12 space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Outfits in {selectedPalette}</h2>
                <p className="text-muted-foreground">Curated looks using your selected color palette</p>
              </div>

              {loadingImages && <p className="text-muted-foreground">Loading palette inspiration…</p>}
              {!loadingImages && images.length === 0 && (
                <p className="text-muted-foreground">No images available. Check your API keys.</p>
              )}
              {!loadingImages && images.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6">
                  {images.map((img, i) => (
                    <Card key={i} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                      <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-muted relative">
                        <Image
                          src={img.src || "/placeholder.svg"}
                          alt={img.alt || "Palette outfit"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-serif font-semibold">{selectedPalette}</h3>
                        <p className="text-sm text-muted-foreground">Designed for your palette</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
