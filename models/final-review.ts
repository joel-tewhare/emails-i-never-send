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

export interface FinalReview {
  reviewData: AIFinalReviewData
  emailOriginal: string
  finalEmail: string
  promptText: string
}
