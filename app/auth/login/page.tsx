"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shirt, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("patchwork_users") || "[]")
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

      if (user) {
        localStorage.setItem("patchwork_current_user", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        alert("Invalid credentials")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
                PATCHWORK
              </span>
            </Link>
            <h1 className="text-4xl font-serif font-bold">Welcome back</h1>
            <p className="text-muted-foreground text-lg">Log in to continue your style journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)]">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg space-y-6 text-white animate-fade-in-up">
            <h2 className="text-5xl font-serif font-bold">Your style awaits</h2>
            <p className="text-xl leading-relaxed text-white/90">
              Log in to access your personalized style profile, outfit recommendations, and moodboards.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-white/20 backdrop-blur-sm animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
