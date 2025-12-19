"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shirt, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

const quizQuestions = [
  {
    id: 1,
    question: "Which aesthetic speaks to you most?",
    options: [
      { value: "vintage", label: "Vintage", gradient: "from-amber-400 to-amber-600" },
      { value: "sporty", label: "Sporty", gradient: "from-blue-400 to-blue-600" },
      { value: "classic", label: "Classic", gradient: "from-slate-400 to-slate-600" },
      { value: "earthcore", label: "Earthcore", gradient: "from-green-400 to-green-600" },
      { value: "streetwear", label: "Streetwear", gradient: "from-purple-400 to-purple-600" },
      { value: "bohemian", label: "Bohemian", gradient: "from-orange-400 to-pink-500" },
      { value: "minimalist", label: "Minimalist", gradient: "from-gray-300 to-gray-500" },
      { value: "preppy", label: "Preppy", gradient: "from-teal-400 to-blue-500" },
      { value: "goth", label: "Goth", gradient: "from-gray-900 to-purple-900" },
      { value: "romantic", label: "Romantic", gradient: "from-rose-300 to-pink-400" },
    ],
  },
  {
    id: 2,
    question: "What's your go-to outfit vibe?",
    options: [
      { value: "casual-comfort", label: "Casual Comfort", gradient: "from-pink-400 to-pink-600" },
      { value: "polished-professional", label: "Polished Professional", gradient: "from-indigo-400 to-indigo-600" },
      { value: "edgy-bold", label: "Edgy & Bold", gradient: "from-red-400 to-red-600" },
      { value: "minimal-chic", label: "Minimal Chic", gradient: "from-gray-400 to-gray-600" },
      { value: "eclectic-artsy", label: "Eclectic & Artsy", gradient: "from-purple-400 to-purple-600" },
      { value: "grunge-rebel", label: "Grunge Rebel", gradient: "from-slate-600 to-gray-800" },
      { value: "cottagecore", label: "Cottagecore", gradient: "from-lime-300 to-green-400" },
      { value: "y2k-futuristic", label: "Y2K Futuristic", gradient: "from-cyan-400 to-fuchsia-500" },
    ],
  },
  {
    id: 3,
    question: "Which colors feel most like you?",
    options: [
      { value: "earth-tones", label: "Earth Tones", gradient: "from-amber-700 to-stone-600" },
      { value: "bold-vibrant", label: "Bold & Vibrant", gradient: "from-fuchsia-500 to-orange-500" },
      { value: "pastels", label: "Soft Pastels", gradient: "from-pink-300 to-blue-300" },
      { value: "monochrome", label: "Monochrome", gradient: "from-black to-gray-400" },
      { value: "jewel-tones", label: "Jewel Tones", gradient: "from-emerald-600 to-purple-600" },
    ],
  },
  {
    id: 4,
    question: "What describes your body type best?",
    options: [
      { value: "hourglass", label: "Hourglass", gradient: "from-rose-400 to-rose-600" },
      { value: "pear", label: "Pear", gradient: "from-green-400 to-green-600" },
      { value: "apple", label: "Apple", gradient: "from-red-400 to-red-600" },
      { value: "rectangle", label: "Rectangle", gradient: "from-blue-400 to-blue-600" },
      { value: "inverted-triangle", label: "Inverted Triangle", gradient: "from-orange-400 to-orange-600" },
    ],
  },
  {
    id: 5,
    question: "What's your skin undertone?",
    options: [
      { value: "warm", label: "Warm (golden, peachy)", gradient: "from-amber-300 to-orange-400" },
      { value: "cool", label: "Cool (pink, rosy)", gradient: "from-pink-300 to-purple-400" },
      { value: "neutral", label: "Neutral (balanced)", gradient: "from-slate-300 to-slate-500" },
      { value: "olive", label: "Olive (greenish)", gradient: "from-green-300 to-green-500" },
      { value: "not-sure", label: "Not Sure", gradient: "from-gray-300 to-gray-500" },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [quizQuestions[currentQuestion].id]: value })

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    }
  }

  const handleComplete = () => {
    setIsCompleting(true)
    const currentUser = JSON.parse(localStorage.getItem("patchwork_current_user") || "{}")
    currentUser.quizAnswers = answers
    localStorage.setItem("patchwork_current_user", JSON.stringify(currentUser))

    setTimeout(() => {
      router.push("/profile")
    }, 1000)
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

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

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 via-primary/20 to-[var(--fashion-red)]/20 border border-primary/30 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Style Quiz
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-balance">
              {quizQuestions[currentQuestion].question}
            </h1>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <Card
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden border-2 ${
                  answers[quizQuestions[currentQuestion].id] === option.value
                    ? "border-primary shadow-xl"
                    : "border-transparent hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`aspect-square bg-gradient-to-br ${option.gradient} p-6 flex items-center justify-center`}
                >
                  <span className="text-xl font-serif font-bold text-white text-center">{option.label}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="border-primary/30"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back
            </Button>

            {currentQuestion === quizQuestions.length - 1 && answers[quizQuestions[currentQuestion].id] && (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-gradient-to-r from-accent via-primary to-[var(--fashion-red)] text-white hover:opacity-90"
              >
                {isCompleting ? "Completing..." : "Complete Quiz"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
