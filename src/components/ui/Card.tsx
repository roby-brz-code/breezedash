import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  accent?: 'emerald' | 'amber' | 'red' | 'blue' | 'gray'
  className?: string
}

const accentColors: Record<string, string> = {
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
  blue: 'border-l-blue-500',
  gray: 'border-l-gray-400',
}

export default function Card({ children, accent, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${
        accent ? `border-l-4 ${accentColors[accent]}` : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
