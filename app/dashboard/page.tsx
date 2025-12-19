"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shirt, Palette, Sparkles, User, LogOut, ImagePlus, Shuffle } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [featured, setFeatured] = useState<any[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
      console.log("Dashboard - Current User:", currentUser)
      
      if (!currentUser.id) {
        console.log("No user ID, redirecting to login")
        router.push("/auth/login")
        return
      }
      if (!currentUser.hasCompletedProfile) {
        console.log("Profile incomplete, redirecting to profile")
        router.push("/profile")
        return
      }
      console.log("Setting user:", currentUser)
      setUser(currentUser)

      // Fetch featured images based on user profile
      const style = currentUser.quizAnswers?.[1] || currentUser.quizAnswers?.[2]
      const bodyType = currentUser.quizAnswers?.[4]
      const height = currentUser.profile?.height ? Number(currentUser.profile.height) : undefined
      const age = currentUser.profile?.age
      const lifestyle = currentUser.profile?.lifestyle
      const climate = currentUser.profile?.climate
      const occasionPref = currentUser.profile?.occasions?.[0]
      const gender = (currentUser.profile?.gender as string | undefined)?.toLowerCase() || "unisex"
      const ethnicity = (currentUser.profile?.ethnicity as string | undefined)?.toLowerCase() || ""
      const params = new URLSearchParams()
      if (style) params.set("style", style)
      if (bodyType) params.set("bodyType", bodyType)
      if (height) params.set("height", String(height))
      if (gender) params.set("gender", gender)
      if (ethnicity) params.set("ethnicity", ethnicity)
      if (age) params.set('age', age)
      if (lifestyle) params.set('lifestyle', lifestyle)
      if (climate) params.set('climate', climate)
      if (occasionPref) params.set('occasion', occasionPref)
      params.set("limit", "6")

      ;(async () => {
        try {
          const res = await fetch(`/api/images?${params.toString()}`)
          const data = await res.json()
          setFeatured((data.images || []).slice(0, 3))
        } catch (e) {
          console.error("Failed to load featured", e)
          setFeatured([])
        } finally {
          setLoadingFeatured(false)
        }
      })()
    } catch (error) {
      console.error("Error loading user:", error)
      router.push("/auth/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("patchwork_current_user")
    router.push("/")
  }

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
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 border border-primary/30 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Your Personal Style Hub
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">Welcome back, {user.name?.split(" ")[0]}!</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Ready to explore your curated style recommendations and create stunning moodboards?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <Card
                  className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-serif font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>

          {/* Style Profile Summary */}
          <Card className="p-8 border-2 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-semibold">Your Style Profile</h2>
                <p className="text-muted-foreground">Personalized just for you</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Style Aesthetic</p>
                <p className="text-lg font-semibold capitalize">
                  {user.quizAnswers?.[1] ? user.quizAnswers[1].replace("-", " ") : "Not set"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Color Preference</p>
                <p className="text-lg font-semibold capitalize">
                  {user.quizAnswers?.[3] ? user.quizAnswers[3].replace("-", " ") : "Not set"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Body Type</p>
                <p className="text-lg font-semibold capitalize">{user.quizAnswers?.[4] || "Not set"}</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/profile">
                <Button variant="outline" className="border-primary/30 bg-transparent">
                  <User className="mr-2 w-4 h-4" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </Card>

          {/* Featured Outfits Preview */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold">Featured For You</h2>
                <p className="text-muted-foreground">Curated outfit suggestions based on your style</p>
              </div>
              <Link href="/outfits">
                <Button className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90">
                  View All Outfits
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {loadingFeatured && <p className="text-muted-foreground col-span-3">Loading your looks…</p>}
              {!loadingFeatured && featured.length === 0 && (
                <p className="text-muted-foreground col-span-3">No images right now. Check your Unsplash key or try again soon.</p>
              )}
              {featured.map((img, i) => (
                <Card
                  key={i}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-secondary to-muted relative">
                    <Image src={img.src || "/placeholder.svg"} alt={img.alt || "Featured outfit"} fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-semibold">{user.quizAnswers?.[2] || "Recommended"}</h3>
                    <p className="text-sm text-muted-foreground">Curated for your style</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const quickActions = [
  {
    title: "Outfit Suggestions",
    description: "Browse curated looks tailored to you",
    icon: Sparkles,
    gradient: "from-pink-400 to-pink-600",
    href: "/outfits",
  },
  {
    title: "Try-This-Fit",
    description: "Swipe through outfit items",
    icon: Shuffle,
    gradient: "from-purple-400 to-purple-600",
    href: "/try-this-fit",
  },
  {
    title: "Moodboard",
    description: "Create style inspiration boards",
    icon: ImagePlus,
    gradient: "from-blue-400 to-blue-600",
    href: "/moodboard",
  },
  {
    title: "Color Palette",
    description: "Discover your perfect colors",
    icon: Palette,
    gradient: "from-amber-400 to-amber-600",
    href: "/colors",
  },
]
