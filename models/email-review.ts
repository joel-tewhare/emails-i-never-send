export interface AISentenceSuggestion {
  original: string
  suggestion: string
  why: string
}

export interface AIReviewData {
  impact_rating_percent: number | null
  impact_rating_explanation: string | null
  coach_review_paragraphs: string[]
  sentence_suggestions: AISentenceSuggestion[]
  next_step: string
}

export interface EmailReview {
  reviewData: AIReviewData
  emailOriginal: string
  promptText: string
  wordLimit: number
}