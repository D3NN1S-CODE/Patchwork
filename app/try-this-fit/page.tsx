"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shirt, ArrowLeft, X, Heart, Info, RotateCcw } from "lucide-react"
import Image from "next/image"

type SwipeItem = {
  id: string | number
  title: string
  brand: string
  price: string
  image: string
  description: string
  sizes: string[]
}

export default function TryThisFitPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<any[]>([])
  const [passed, setPassed] = useState<any[]>([])
  const [showInfo, setShowInfo] = useState(false)
  const [items, setItems] = useState<SwipeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    if (!currentUser.id) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setLiked(currentUser.likedItems || [])

    // Build params from user profile
    const style = currentUser.quizAnswers?.[1] || currentUser.quizAnswers?.[2]
    const bodyType = currentUser.quizAnswers?.[4]
    const height = currentUser.profile?.height ? Number(currentUser.profile.height) : undefined
    const gender = (currentUser.profile?.gender as string | undefined)?.toLowerCase() || 'unisex'
    const ethnicity = (currentUser.profile?.ethnicity as string | undefined)?.toLowerCase() || ''
    const params = new URLSearchParams()
    if (style) params.set('style', style)
    if (bodyType) params.set('bodyType', bodyType)
    if (height) params.set('height', String(height))
    if (gender) params.set('gender', gender)
    if (ethnicity) params.set('ethnicity', ethnicity)
    params.set('limit', '20')

    ;(async () => {
      try {
        const res = await fetch(`/api/images?${params.toString()}`)
        const data = await res.json()
        const mapped: SwipeItem[] = (data.images || []).map((img: any, idx: number) => ({
          id: img.id || idx,
          title: 'Recommended Fit',
          brand: (img.author as string) || 'Curator',
          price: '$' + (80 + (idx % 5) * 15),
          image: img.src,
          description: 'Selected to match your style and proportions',
          sizes: ['XS','S','M','L','XL'],
        }))
        setItems(mapped)
      } catch (e) {
        console.error('Failed to load swipe items', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [router])

  const currentItem = items[currentIndex]

  const handleLike = () => {
    if (!currentItem) return
    const newLiked = [...liked, currentItem.id]
    setLiked(newLiked)

    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    currentUser.likedItems = newLiked
    localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))

    nextItem()
  }

  const handlePass = () => {
    if (!currentItem) return
    setPassed([...passed, currentItem.id])
    nextItem()
  }

  const nextItem = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowInfo(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setPassed([])
    setShowInfo(false)
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh flex items-center justify-center">
        <Card className="p-8">Loading personalized fits…</Card>
      </div>
    )
  }

  if (!loading && currentIndex >= items.length && items.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh flex items-center justify-center">
        <Card className="p-12 text-center space-y-6 max-w-md mx-4 border-2 bg-card/50 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 flex items-center justify-center mx-auto">
      const age = currentUser.profile?.age
      const lifestyle = currentUser.profile?.lifestyle
      const climate = currentUser.profile?.climate
      const occasionPref = currentUser.profile?.occasions?.[0]
      if (gender) params.set('gender', gender)
      if (age) params.set('age', age)
      if (lifestyle) params.set('lifestyle', lifestyle)
      if (climate) params.set('climate', climate)
      if (occasionPref) params.set('occasion', occasionPref)
          </div>
          <h2 className="text-3xl font-serif font-bold">All Done!</h2>
          <p className="text-lg text-muted-foreground">
            You've swiped through all items. Check your likes in your profile!
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Start Over
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-primary/30 bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

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
              Try-This-Fit
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {items.length}
            </span>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Swipe Card */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="overflow-hidden border-4 border-white shadow-2xl animate-scale-in">
            <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-muted relative">
              <Image
                src={currentItem.image || "/placeholder.svg"}
                alt={currentItem.title}
                fill
                className="object-cover"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="w-5 h-5" />
              </Button>

              {showInfo && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex flex-col justify-end animate-fade-in-up text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{currentItem.title}</h3>
                  <p className="text-lg mb-1">{currentItem.brand}</p>
                  <p className="text-sm opacity-90 mb-4">{currentItem.description}</p>
                  <p className="text-2xl font-bold mb-4">{currentItem.price}</p>
                  <div className="flex gap-2 flex-wrap">
                    {currentItem.sizes.map((size) => (
                      <div key={size} className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-semibold mb-1">{currentItem.title}</h3>
                <p className="text-muted-foreground">{currentItem.brand}</p>
              </div>

              {/* Swipe Actions */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-20 h-20 rounded-full border-4 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                  onClick={handlePass}
                >
                  <X className="w-8 h-8 text-red-500" />
                </Button>

                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] hover:opacity-90"
                  onClick={handleLike}
                >
                  <Heart className="w-8 h-8 text-white" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">Swipe or tap to decide</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
