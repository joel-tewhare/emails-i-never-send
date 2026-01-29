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

// Word limit helper functions
export function getWordCount(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export function getWordsRemaining(
  emailContent: string,
  selectedWordLimit: number | undefined,
): number {
  if (!selectedWordLimit) return 0
  const currentCount = getWordCount(emailContent)
  return Math.max(0, selectedWordLimit - currentCount)
}

export function isWordLimitReached(
  emailContent: string,
  selectedWordLimit: number | undefined,
): boolean {
  if (!selectedWordLimit) return false
  return getWordCount(emailContent) >= selectedWordLimit
}

// Time limit helper functions
export function getTimeLimitMinutes(
  selectedTimeLimit: string | undefined,
): number | null {
  if (!selectedTimeLimit || selectedTimeLimit.toLowerCase() === 'off') {
    return null
  }
  const match = selectedTimeLimit.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

export function formatTimeRemaining(
  timeRemaining: number | null,
  selectedTimeLimit: string | undefined,
): string {
  const minutes = getTimeLimitMinutes(selectedTimeLimit)
  if (minutes === null) return '—'

  if (timeRemaining === null) {
    return `${minutes}:00`
  }

  const mins = Math.floor(timeRemaining / 60)
  const secs = timeRemaining % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function isTimeLimitReached(timeRemaining: number | null): boolean {
  return timeRemaining !== null && timeRemaining <= 0
}
