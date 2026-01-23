// server/gemini/rewriteSchema.ts

export const rewriteSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    impact_rating_percent: { type: 'number' },
    impact_rating_explanation: { type: 'string' },

    change_from_original_percent: { type: ['number', 'null'] },
    change_explanation: { type: ['string', 'null'] },

    coach_review_paragraphs: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
    },

    sentence_suggestions: {
      type: 'array',
      maxItems: 2,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          original: { type: 'string' },
          suggestion: { type: 'string' },
          why: { type: 'string' },
        },
        required: ['original', 'suggestion', 'why'],
      },
    },

    spoken_suggestion_summary: {
      type: ['string', 'null'],
      maxLength: 300,
    },

    next_step: { type: 'string' },
  },
  required: [
    'impact_rating_percent',
    'impact_rating_explanation',
    'change_from_original_percent',
    'change_explanation',
    'coach_review_paragraphs',
    'sentence_suggestions',
    'spoken_suggestion_summary',
    'next_step',
  ],
} as const
