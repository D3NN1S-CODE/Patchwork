"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Shirt, ArrowRight, Ruler, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    shoeSize: "",
    inseam: "",
    gender: "unisex", // optional: unisex | androgynous | feminine-leaning | masculine-leaning
    ethnicity: "", // optional: helps personalize visual recommendations
    age: "", // optional age range
    lifestyle: "", // optional: active | moderate | relaxed
    climate: "", // optional: tropical | temperate | cold | varied
    occasions: [] as string[], // optional: work, casual, evening, athletic, etc.
  })

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    if (currentUser.profile) {
      setFormData(currentUser.profile)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
      currentUser.profile = formData
      currentUser.hasCompletedProfile = true
      console.log("Saving profile:", currentUser)
      localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Error saving profile:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--fashion-pink)]/10 via-[var(--fashion-purple)]/10 via-background to-[var(--fashion-red)]/10 animate-gradient-mesh">
      {/* Header */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-primary to-[var(--fashion-red)] flex items-center justify-center">
            <Shirt className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-serif font-bold bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] bg-clip-text text-transparent">
            PATCHWORK
          </span>
        </Link>
      </nav>

      {/* Profile Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 via-primary/20 to-[var(--fashion-red)]/20">
              <Ruler className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">Complete Your Profile</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Help us understand your measurements so we can provide the most accurate outfit recommendations tailored
              to your body.
            </p>
          </div>

          {/* Form */}
          <Card className="p-8 md:p-12 border-2 bg-card/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Measurements */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-semibold">Basic Measurements</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Identity & Expression (optional) */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <User className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-semibold">Personal Details (optional)</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age Range</Label>
                    <select
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="h-12 rounded-md border bg-background w-full px-3"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55-64">55-64</option>
                      <option value="65+">65+</option>
                    </select>
                    <p className="text-muted-foreground text-sm">Helps tailor age-appropriate styles.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lifestyle">Lifestyle</Label>
                    <select
                      id="lifestyle"
                      value={formData.lifestyle}
                      onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                      className="h-12 rounded-md border bg-background w-full px-3"
                    >
                      <option value="">Select lifestyle</option>
                      <option value="active">Active / Athletic</option>
                      <option value="moderate">Moderately Active</option>
                      <option value="relaxed">Relaxed / Sedentary</option>
                      <option value="mixed">Mixed / Varied</option>
                    </select>
                    <p className="text-muted-foreground text-sm">Influences comfort and functionality.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="climate">Climate</Label>
                    <select
                      id="climate"
                      value={formData.climate}
                      onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                      className="h-12 rounded-md border bg-background w-full px-3"
                    >
                      <option value="">Select climate</option>
                      <option value="tropical">Tropical / Hot & Humid</option>
                      <option value="temperate">Temperate / Mild</option>
                      <option value="cold">Cold / Winter</option>
                      <option value="varied">Varied / All Seasons</option>
                    </select>
                    <p className="text-muted-foreground text-sm">Helps suggest seasonally appropriate outfits.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Preferred style spectrum</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="h-12 rounded-md border bg-background w-full px-3"
                    >
                      <option value="unisex">Unisex / Neutral (default)</option>
                      <option value="androgynous">Androgynous / Gender-expansive</option>
                      <option value="feminine-leaning">Feminine‑leaning</option>
                      <option value="masculine-leaning">Masculine‑leaning</option>
                    </select>
                    <p className="text-muted-foreground text-sm">
                      This guides image suggestions; you can skip it for inclusive results.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity / Complexion (optional)</Label>
                    <select
                      id="ethnicity"
                      value={formData.ethnicity}
                      onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                      className="h-12 rounded-md border bg-background w-full px-3"
                    >
                      <option value="">Prefer not to say (inclusive search)</option>
                      <option value="asian">Asian / East Asian</option>
                      <option value="south-asian">South Asian / Desi</option>
                      <option value="black">Black / African descent</option>
                      <option value="latino">Latino / Hispanic</option>
                      <option value="middle-eastern">Middle Eastern / Arab</option>
                      <option value="white">White / Caucasian</option>
                      <option value="mixed">Mixed / Multiracial</option>
                      <option value="indigenous">Indigenous / Native</option>
                      <option value="pacific-islander">Pacific Islander</option>
                    </select>
                    <p className="text-muted-foreground text-sm">
                      Helps tailor visual results; entirely optional.
                    </p>
                  </div>
                </div>
              </div>

                {/* Lifestyle & Context (optional) */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <User className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-serif font-semibold">Lifestyle & Context (optional)</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min={12}
                        max={90}
                        placeholder="28"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="h-12"
                      />
                      <p className="text-muted-foreground text-sm">Optional: helps adjust silhouettes and references.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lifestyle">Lifestyle</Label>
                      <select
                        id="lifestyle"
                        value={formData.lifestyle}
                        onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                        className="h-12 rounded-md border bg-background"
                      >
                        <option value="">Select (optional)</option>
                        <option value="active">Active / On-the-go</option>
                        <option value="office">Office / Corporate</option>
                        <option value="student">Student / Campus</option>
                        <option value="creative">Creative / Studio</option>
                        <option value="traveler">Traveler / Hybrid</option>
                        <option value="formal">Formal / Events</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="climate">Climate</Label>
                      <select
                        id="climate"
                        value={formData.climate}
                        onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                        className="h-12 rounded-md border bg-background"
                      >
                        <option value="">Select (optional)</option>
                        <option value="tropical">Tropical / Humid</option>
                        <option value="temperate">Temperate / Mild</option>
                        <option value="cold">Cold / Wintery</option>
                        <option value="dry">Dry / Arid</option>
                        <option value="four-season">Four-season / Variable</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Occasions you prioritize</Label>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {["work", "casual", "evening", "athletic", "travel", "events"].map((occ) => {
                          const selected = formData.occasions.includes(occ)
                          return (
                            <button
                              key={occ}
                              type="button"
                              className={`px-3 py-2 rounded-full border transition ${selected ? "bg-primary text-white border-primary" : "border-border"}`}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  occasions: selected
                                    ? formData.occasions.filter((o) => o !== occ)
                                    : [...formData.occasions, occ],
                                })
                              }
                            >
                              {occ}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-muted-foreground text-sm">Pick a few that matter most.</p>
                    </div>
                  </div>
                </div>

              {/* Body Measurements */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Ruler className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-semibold">Body Measurements</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bust">Bust/Chest (cm)</Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder="90"
                      value={formData.bust}
                      onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="70"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips (cm)</Label>
                    <Input
                      id="hips"
                      type="number"
                      placeholder="95"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inseam">Inseam (cm)</Label>
                    <Input
                      id="inseam"
                      type="number"
                      placeholder="75"
                      value={formData.inseam}
                      onChange={(e) => setFormData({ ...formData, inseam: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shoeSize">Shoe Size (US)</Label>
                    <Input
                      id="shoeSize"
                      type="number"
                      step="0.5"
                      placeholder="8.5"
                      value={formData.shoeSize}
                      onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Profile & Continue"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
