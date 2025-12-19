import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Palette, Users, TrendingUp, ArrowRight, Shirt } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-serif font-bold bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
            PATCHWORK
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-medium">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="font-medium bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 border border-primary/30 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Your Personal Digital Stylist
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight text-balance">
                <span className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
                  Style That Knows You
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed text-pretty">
                PATCHWORK is a digital stylist that studies{" "}
                <span className="font-semibold text-foreground">the wearer</span>, not the clothes. Get personalized
                outfit recommendations based on your measurements, skin undertone, and unique style preferences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90"
                  >
                    Start Your Style Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-8 py-6 border-primary/30 bg-transparent"
                  >
                    Take Style Quiz
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl">
                <Image
                  src="/fashionable-person-wearing-colorful-stylish-outfit.jpg"
                  alt="Fashion styling"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-2xl font-serif font-semibold">Discover Your Signature Style</p>
                </div>
              </div>

              {/* Floating style cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <p className="text-sm font-semibold text-primary">Vintage</p>
              </div>
              <div
                className="absolute top-1/3 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-sm font-semibold text-accent">Streetwear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-r from-[var(--fashion-pink)]/20 via-[var(--fashion-purple)]/20 to-[var(--fashion-red)]/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-balance">
              A Stylist That{" "}
              <span className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
                Knows You
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed text-pretty">
              Most style apps focus on trends and clothes. We focus on{" "}
              <span className="font-semibold text-foreground">you</span>. PATCHWORK learns your measurements,
              understands your skin undertone, and respects your personal aesthetic. Whether you're vintage, sporty,
              classic, earthcore, or streetwear—we help you look and feel amazing in what you wear.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold">Your Style Toolkit</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Everything you need to discover and refine your personal style
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Style Categories */}
      <section className="py-24 bg-gradient-to-br from-[var(--fashion-accent)]/20 via-[var(--fashion-purple)]/15 to-[var(--fashion-pink)]/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold">Find Your Aesthetic</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              From vintage to streetwear, discover the style that speaks to you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {styleCategories.map((category, index) => (
              <div
                key={category.name}
                className="group relative rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${category.gradient} p-8 flex items-center justify-center`}
                >
                  <span className="text-2xl font-serif font-bold text-white text-center">{category.name}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] rounded-3xl p-12 lg:p-16 text-white">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-balance">Ready to Discover Your Style?</h2>
            <p className="text-xl lg:text-2xl leading-relaxed text-white/90 text-pretty">
              Take our style quiz and get personalized outfit recommendations tailored just for you
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-12 py-7 bg-white text-primary hover:bg-white/90">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-gradient-to-r from-background via-[var(--fashion-purple)]/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-serif font-semibold bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
                PATCHWORK
              </span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 PATCHWORK. Style that knows you.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Style Quiz",
    description: "Interactive quiz with illustrated tiles to discover your unique aesthetic and preferences.",
    icon: Sparkles,
  },
  {
    title: "Color Palette",
    description: "Get personalized color recommendations based on design theory and your skin undertone.",
    icon: Palette,
  },
  {
    title: "Outfit Suggestions",
    description: "Curated outfit recommendations displayed as cards in a moving gallery carousel.",
    icon: TrendingUp,
  },
  {
    title: "Moodboard Generator",
    description: "Create and organize your style inspiration with drag-and-drop moodboards.",
    icon: Shirt,
  },
  {
    title: "Profile Builder",
    description: "Input your measurements, height, and preferences for truly personalized suggestions.",
    icon: Users,
  },
  {
    title: "Try-This-Fit",
    description: "Swipe through curated outfit items tailored to your style profile and body type.",
    icon: ArrowRight,
  },
]

const styleCategories = [
  { name: "Vintage", gradient: "from-amber-400 to-amber-600" },
  { name: "Sporty", gradient: "from-blue-400 to-blue-600" },
  { name: "Classic", gradient: "from-slate-400 to-slate-600" },
  { name: "Earthcore", gradient: "from-green-400 to-green-600" },
  { name: "Streetwear", gradient: "from-purple-400 to-purple-600" },
]
