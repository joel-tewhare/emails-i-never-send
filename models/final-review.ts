export interface Check {
  check: string
  passed: boolean
  why: string
}

export interface CounterfactualOutcome {
  probabilityPercent: number
  likelyRecipientResponse: string
  why: string
}

export interface Reflection {
  keywordOrPhrase: string
  influence: string
}

// NOTE: This is the raw enum from the schema (values are NOT camelCased)
export type OverallResult = 'pass' | 'needs_work'

export interface Scores {
  clarity: number
  toneRespect: number
  directness: number
  efficiency: number
}
export interface Evaluation {
  overallResult: OverallResult
  scores: Scores
  checks: Check[]
  keyDrivers: string[]
}
export interface AIFinalReviewData {
  impactRatingPercent: number
  changeFromOriginalPercent: number | null
  changeSummary: string | null
  evaluation: Evaluation
  counterfactualOutcomes: CounterfactualOutcome[]
  coachReviewParagraphs: string[]
  reflections: Reflection[]
  spokenReflectionsSummary: string | null
  nextStep: string
}
export interface FinalReview {
  reviewData: AIFinalReviewData
  emailOriginal: string
  finalEmail: string
  promptText: string
}
