"use client"

import { useRef } from "react"

export function FloatingCube() {
  const cubeRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div
        ref={cubeRef}
        className="relative w-64 h-64 animate-cube-solve preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Cube faces with Rubik's colors */}
        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl flex items-center justify-center text-6xl font-bold"
          style={{
            transform: "translateZ(132px)",
            background: "oklch(0.52 0.19 252)",
            color: "oklch(0.98 0.01 106)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-cube-white/20 rounded-lg border-2 border-cube-white/40" />
            ))}
          </div>
        </div>

        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl"
          style={{
            transform: "rotateY(180deg) translateZ(132px)",
            background: "oklch(0.58 0.17 152)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-cube-white/20 rounded-lg border-2 border-cube-white/40" />
            ))}
          </div>
        </div>

        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl"
          style={{
            transform: "rotateY(90deg) translateZ(132px)",
            background: "oklch(0.62 0.23 28)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-cube-white/20 rounded-lg border-2 border-cube-white/40" />
            ))}
          </div>
        </div>

        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl"
          style={{
            transform: "rotateY(-90deg) translateZ(132px)",
            background: "oklch(0.75 0.18 58)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-cube-white/20 rounded-lg border-2 border-cube-white/40" />
            ))}
          </div>
        </div>

        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl"
          style={{
            transform: "rotateX(90deg) translateZ(132px)",
            background: "oklch(0.98 0.01 106)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-primary/10 rounded-lg border-2 border-primary/20" />
            ))}
          </div>
        </div>

        <div
          className="absolute w-full h-full border-4 border-foreground/10 rounded-2xl"
          style={{
            transform: "rotateX(-90deg) translateZ(132px)",
            background: "oklch(0.92 0.15 94)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-foreground/10 rounded-lg border-2 border-foreground/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
