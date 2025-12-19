"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shirt, ArrowLeft, Plus, Trash2, ImagePlus, Download } from "lucide-react"
import Image from "next/image"

export default function MoodboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [moodboards, setMoodboards] = useState<any[]>([])
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null)
  const [newBoardName, setNewBoardName] = useState("")
  const [showNewBoardInput, setShowNewBoardInput] = useState(false)
  const [inspo, setInspo] = useState<string[]>([])
  const [loadingInspo, setLoadingInspo] = useState(true)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    if (!currentUser.id) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)

    const savedMoodboards = JSON.parse(localStorage.getItem(`patchwork_moodboards_${currentUser.id}`) || "[]")
    setMoodboards(savedMoodboards)

    // Fetch inspiration images based on quiz/profile
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
      params.set("limit", "20")

    ;(async () => {
      try {
        const res = await fetch(`/api/images?${params.toString()}`)
        const data = await res.json()
        setInspo((data.images || []).map((img: any) => img.src).filter(Boolean))
      } catch (e) {
        console.error("Failed to load moodboard inspiration", e)
        setInspo([])
      } finally {
        setLoadingInspo(false)
      }
    })()
  }, [router])

  const createMoodboard = () => {
    if (!newBoardName.trim()) return

    const newBoard = {
      id: Date.now(),
      name: newBoardName,
      images: [],
      createdAt: new Date().toISOString(),
    }

    const updated = [...moodboards, newBoard]
    setMoodboards(updated)
    localStorage.setItem(`patchwork_moodboards_${user.id}`, JSON.stringify(updated))
    setNewBoardName("")
    setShowNewBoardInput(false)
    setSelectedBoard(newBoard.id)
  }

  const deleteMoodboard = (id: number) => {
    const updated = moodboards.filter((board) => board.id !== id)
    setMoodboards(updated)
    localStorage.setItem(`patchwork_moodboards_${user.id}`, JSON.stringify(updated))
    if (selectedBoard === id) setSelectedBoard(null)
  }

  const addImageToBoard = (boardId: number, imageUrl: string) => {
    const updated = moodboards.map((board) =>
      board.id === boardId ? { ...board, images: [...board.images, imageUrl] } : board,
    )
    setMoodboards(updated)
    localStorage.setItem(`patchwork_moodboards_${user.id}`, JSON.stringify(updated))
  }

  const removeImageFromBoard = (boardId: number, imageIndex: number) => {
    const updated = moodboards.map((board) =>
      board.id === boardId ? { ...board, images: board.images.filter((_: any, i: number) => i !== imageIndex) } : board,
    )
    setMoodboards(updated)
    localStorage.setItem(`patchwork_moodboards_${user.id}`, JSON.stringify(updated))
  }

  const currentBoard = moodboards.find((board) => board.id === selectedBoard)

  if (!user) return null

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
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12 animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold">Style Moodboards</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Create visual inspiration boards to capture your style ideas and fashion inspiration
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Moodboard List */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-4 bg-card/50 backdrop-blur-sm">
                <h3 className="font-serif font-semibold mb-4">Your Moodboards</h3>

                <div className="space-y-2">
                  {moodboards.map((board) => (
                    <div
                      key={board.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                        selectedBoard === board.id
                          ? "bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-primary"
                          : "hover:bg-accent/10 border border-border"
                      }`}
                      onClick={() => setSelectedBoard(board.id)}
                    >
                      <div>
                        <p className="font-medium">{board.name}</p>
                        <p className="text-xs text-muted-foreground">{board.images.length} images</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMoodboard(board.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {showNewBoardInput ? (
                  <div className="mt-4 space-y-2">
                    <Input
                      placeholder="Moodboard name"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createMoodboard()}
                    />
                    <div className="flex gap-2">
                      <Button onClick={createMoodboard} size="sm" className="flex-1">
                        Create
                      </Button>
                      <Button onClick={() => setShowNewBoardInput(false)} variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowNewBoardInput(true)} className="w-full mt-4" variant="outline">
                    <Plus className="mr-2 w-4 h-4" />
                    New Moodboard
                  </Button>
                )}
              </Card>
            </div>

            {/* Main Area - Moodboard Canvas */}
            <div className="lg:col-span-3">
              {currentBoard ? (
                <Card className="p-6 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold">{currentBoard.name}</h2>
                    <Button className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90">
                      <Download className="mr-2 w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  {/* Inspiration from live images */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">Add fashion inspiration:</p>
                    {loadingInspo && <p className="text-muted-foreground text-sm">Loading inspiration…</p>}
                    {!loadingInspo && inspo.length === 0 && (
                      <p className="text-muted-foreground text-sm">No images right now. Check your key or try again soon.</p>
                    )}
                    <div className="grid grid-cols-4 gap-2">
                      {inspo.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => addImageToBoard(currentBoard.id, src)}
                        >
                          <Image src={src} alt={`Fashion ${i + 1}`} width={300} height={300} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Moodboard Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {currentBoard.images.map((img: string, index: number) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Moodboard item ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeImageFromBoard(currentBoard.id, index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {currentBoard.images.length === 0 && (
                      <div className="col-span-3 text-center py-12 text-muted-foreground">
                        <ImagePlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Click on images above to add them to your moodboard</p>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="p-12 bg-card/50 backdrop-blur-sm text-center">
                  <ImagePlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-serif font-semibold mb-2">No Moodboard Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Create or select a moodboard to start curating your style inspiration
                  </p>
                  <Button
                    onClick={() => setShowNewBoardInput(true)}
                    className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    Create Your First Moodboard
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
