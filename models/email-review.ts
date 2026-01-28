export interface CounterfactualOutcome {
  probabilityPercent: number
  likelyRecipientResponse: string
  why: string
}

export interface LeveragePoint {
  keywordOrPhrase: string
  influence: string
}

export interface AISentenceSuggestion {
  original: string
  suggestion: string
  why: string
}

export interface AIReviewData {
  ratingDefinition: string
  impactRatingPercent: number | null
  ratingExplanation: string | null
  counterfactualOutcomes: CounterfactualOutcome[]
  leveragePoints: LeveragePoint[]
  coachReviewParagraphs: string[]
  sentenceSuggestions: AISentenceSuggestion[]
  spokenLeveragePointsSummary: string | null
  nextStep: string
}

export interface EmailReview {
  reviewData: AIReviewData
  emailOriginal: string
  promptText: string
  wordLimit: number
}
