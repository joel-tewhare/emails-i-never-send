export interface AIFinalSentenceSuggestion {
  original: string
  suggestion: string
  why: string
}

export interface AIFinalReviewData {
  impactRatingPercent: number
  impactRatingExplanation: string | null
  changeFromOriginalPercent: number | null
  changeExplanation: string | null
  coachReviewParagraphs: string[]
  sentenceSuggestions: AIFinalSentenceSuggestion[]
  spokenSuggestionSummary: string | null
  nextStep: string
}

export interface EmailReview {
  reviewData: AIFinalReviewData
  emailOriginal: string
  promptText: string
  wordLimit: number
}
