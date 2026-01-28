export const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    rating_definition: {
      type: 'string',
      maxLength: 300,
    },

    impact_rating_percent: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },

    rating_explanation: {
      type: 'string',
      maxLength: 300,
    },

    counterfactual_outcomes: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          probability_percent: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          likely_recipient_response: {
            type: 'string',
            maxLength: 200,
          },
          why: {
            type: 'string',
            maxLength: 300,
          },
        },
        required: ['probability_percent', 'likely_recipient_response', 'why'],
      },
    },

    leverage_points: {
      type: 'array',
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          keyword_or_phrase: { type: 'string' },
          influence: { type: 'string', maxLength: 200 },
        },
        required: ['keyword_or_phrase', 'influence'],
      },
    },

    coach_review_paragraphs: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 4,
    },

    spoken_leverage_points_summary: {
      type: ['string', 'null'],
      maxLength: 300,
    },

    next_step: {
      type: 'string',
      maxLength: 200,
    },
  },
  required: [
    'rating_definition',
    'impact_rating_percent',
    'rating_explanation',
    'counterfactual_outcomes',
    'coach_review_paragraphs',
    'next_step',
  ],
} as const
