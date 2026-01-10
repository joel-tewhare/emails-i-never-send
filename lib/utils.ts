import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export function getScenarioColor(scenarioId: number): string {
  const colorMap: Record<number, string> = {
    1: 'bg-email-blue',
    2: 'bg-email-gold',
    3: 'bg-email-mauve',
    4: 'bg-email-mint',
    5: 'bg-email-white',
  }
  return colorMap[scenarioId] || 'bg-email-white'
}
