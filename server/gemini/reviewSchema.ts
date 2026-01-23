export const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    impact_rating_percent: { type: ['number', 'null'] },
    impact_rating_explanation: { type: ['string', 'null'] },

    coach_review_paragraphs: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 4,
    },

    sentence_suggestions: {
      type: 'array',
      maxItems: 3,
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
    'coach_review_paragraphs',
    'sentence_suggestions',
    'next_step',
  ],
} as const
