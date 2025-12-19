"use client"

import { useEffect, useState } from "react"

export function GoldenStrings() {
  const [strings, setStrings] = useState<Array<{ id: number; top: string; delay: number }>>([])

  useEffect(() => {
    // Generate random strings on mount
    const newStrings = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
    }))
    setStrings(newStrings)
  }, [])

  return (
    <div className="golden-strings">
      {strings.map((string) => (
        <div
          key={string.id}
          className="golden-string animate-string-flow"
          style={{
            top: string.top,
            animationDelay: `${string.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
