export interface AISentenceSuggestion {
  original: string
  suggestion: string
  why: string
}

export interface AIReviewData {
  impactRatingPercent: number | null
  impactRatingExplanation: string | null
  coachReviewParagraphs: string[]
  sentenceSuggestions: AISentenceSuggestion[]
  nextStep: string
}

export interface EmailReview {
  reviewData: AIReviewData
  emailOriginal: string
  promptText: string
  wordLimit: number
}