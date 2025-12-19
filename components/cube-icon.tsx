"use client"

interface CubeIconProps {
  className?: string
}

export function CubeIcon({ className = "w-10 h-10" }: CubeIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cubeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.52 0.19 252)" />
          <stop offset="100%" stopColor="oklch(0.62 0.23 28)" />
        </linearGradient>
      </defs>

      {/* Top face */}
      <path
        d="M 50 10 L 80 25 L 50 40 L 20 25 Z"
        fill="oklch(0.92 0.15 94)"
        stroke="oklch(0.15 0.02 264)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Left face */}
      <path
        d="M 20 25 L 20 65 L 50 80 L 50 40 Z"
        fill="oklch(0.52 0.19 252)"
        stroke="oklch(0.15 0.02 264)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Right face */}
      <path
        d="M 50 40 L 50 80 L 80 65 L 80 25 Z"
        fill="oklch(0.62 0.23 28)"
        stroke="oklch(0.15 0.02 264)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
