"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Shirt, ArrowLeft, Heart, Share2, Filter } from "lucide-react"
import Image from "next/image"

type OutfitCard = {
  id: string | number
  title: string
  description: string
  image: string
  style?: string
  occasion?: string
  colors: string[]
  alt?: string
  author?: string
  provider?: string
}

export default function OutfitsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filter, setFilter] = useState("all")
  const [items, setItems] = useState<OutfitCard[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OutfitCard | null>(null)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    if (!currentUser.id) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setFavorites(currentUser.favoriteOutfits || [])
    // derive search inputs from quiz/profile
    const style = currentUser.quizAnswers?.[1] || currentUser.quizAnswers?.[2]
    const colorsAnswer = currentUser.quizAnswers?.[3]
    const bodyType = currentUser.quizAnswers?.[4]
    const height = currentUser.profile?.height ? Number(currentUser.profile.height) : undefined
    const age = currentUser.profile?.age
    const lifestyle = currentUser.profile?.lifestyle
    const climate = currentUser.profile?.climate
    const occasionPref = currentUser.profile?.occasions?.[0]
    const colors =
      colorsAnswer === 'earth-tones'
        ? ['earth tones', 'beige', 'brown']
        : colorsAnswer === 'bold-vibrant'
        ? ['vibrant', 'red', 'purple']
        : colorsAnswer === 'pastels'
        ? ['pastel', 'pink', 'blue']
        : colorsAnswer === 'monochrome'
        ? ['black', 'white', 'gray']
        : colorsAnswer === 'jewel-tones'
        ? ['emerald', 'sapphire', 'ruby']
        : undefined
    // Gender: read optional profile.gender, default to 'unisex' for inclusion
    const gender = (currentUser.profile?.gender as string | undefined)?.toLowerCase() || 'unisex'
    const ethnicity = (currentUser.profile?.ethnicity as string | undefined)?.toLowerCase() || ''

    const params = new URLSearchParams()
    if (style) params.set('style', style)
    if (bodyType) params.set('bodyType', bodyType)
    if (height) params.set('height', String(height))
    if (colors?.length) params.set('colors', colors.join(','))
    if (gender) params.set('gender', gender)
    if (ethnicity) params.set('ethnicity', ethnicity)
    if (age) params.set('age', age)
    if (lifestyle) params.set('lifestyle', lifestyle)
    if (climate) params.set('climate', climate)
    if (occasionPref) params.set('occasion', occasionPref)
    params.set('limit', '24')

    ;(async () => {
      try {
        const res = await fetch(`/api/images?${params.toString()}`)
        const data = await res.json()
        const cards: OutfitCard[] = (data.images || []).map((img: any, idx: number) => ({
          id: img.id || idx,
          title: user?.quizAnswers?.[2] ? user.quizAnswers[2].replace('-', ' ') : 'Recommended Look',
          description: 'AI-curated look matching your style profile',
          image: img.src,
          style: style,
          occasion: 'casual',
          colors: colors || ['neutral'],
          alt: img.alt || 'Outfit inspiration',
          author: img.author,
          provider: img.provider,
        }))
        setItems(cards)
      } catch (e) {
        console.error('Failed to load images', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const toggleFavorite = (id: string | number) => {
    const key = String(id)
    const newFavorites = favorites.includes(key) ? favorites.filter((f) => f !== key) : [...favorites, key]
    setFavorites(newFavorites)

    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    currentUser.favoriteOutfits = newFavorites
    localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))
  }

  const filteredOutfits = filter === "all" ? items : items.filter((o) => o.style === filter)

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh">
      {/* Header */}
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
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">Outfit Suggestions</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Curated looks tailored to your style preferences and body type
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {["all", "vintage", "streetwear", "classic", "sporty"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white"
                    : "border-primary/30"
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-12 text-muted-foreground">Fetching looks for your profile…</div>
          )}

          {/* Empty state */}
          {!loading && filteredOutfits.length === 0 && (
            <Card className="p-8 border-dashed border-2">
              <h3 className="text-xl font-serif font-semibold mb-2">No looks yet</h3>
              <p className="text-muted-foreground text-sm">
                We couldn’t fetch images right now (rate limit or connectivity). Try again in a bit or verify your
                Unsplash key.
              </p>
            </Card>
          )}

          {/* Outfits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOutfits.map((outfit, index) => (
              <Card
                key={outfit.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-muted relative">
                  <Image src={outfit.image || "/placeholder.svg"} alt={outfit.title} fill className="object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white/90 hover:bg-white"
                      onClick={() => toggleFavorite(outfit.id)}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(String(outfit.id)) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-serif font-semibold">{outfit.title}</h3>
                  <p className="text-muted-foreground">{outfit.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {outfit.colors.map((color) => (
                      <div key={color} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium capitalize">
                        {color}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90"
                    onClick={() => setSelected(outfit)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image src={selected.image || "/placeholder.svg"} alt={selected.alt || selected.title} fill className="object-cover" />
              </div>
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                  <DialogDescription>{selected.description}</DialogDescription>
                </DialogHeader>
                <div className="text-sm text-muted-foreground space-y-1">
                  {selected.style && (
                    <div>
                      <strong>Style:</strong> {selected.style}
                    </div>
                  )}
                  {selected.colors?.length ? (
                    <div>
                      <strong>Palette:</strong> {selected.colors.join(", ")}
                    </div>
                  ) : null}
                  {selected.author && (
                    <div>
                      <strong>Photographer:</strong> {selected.author}
                    </div>
                  )}
                  {selected.provider && (
                    <div>
                      <strong>Source:</strong> {selected.provider}
                    </div>
                  )}
                </div>
                <Button onClick={() => setSelected(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
