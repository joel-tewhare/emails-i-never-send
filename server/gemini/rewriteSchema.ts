export const rewriteSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    impact_rating_percent: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },

    change_from_original_percent: {
      type: ['number', 'null'],
      minimum: -100,
      maximum: 100,
    },

    change_summary: {
      type: ['string', 'null'],
      maxLength: 240,
    },

    evaluation: {
      type: 'object',
      additionalProperties: false,
      properties: {
        overall_result: {
          type: 'string',
          enum: ['pass', 'needs_work'],
        },

        scores: {
          type: 'object',
          additionalProperties: false,
          properties: {
            clarity: { type: 'number', minimum: 0, maximum: 100 },
            tone_respect: { type: 'number', minimum: 0, maximum: 100 },
            directness: { type: 'number', minimum: 0, maximum: 100 },
            efficiency: { type: 'number', minimum: 0, maximum: 100 },
          },
          required: ['clarity', 'tone_respect', 'directness', 'efficiency'],
        },

        checks: {
          type: 'array',
          minItems: 2,
          maxItems: 4,
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              check: { type: 'string', maxLength: 80 },
              passed: { type: 'boolean' },
              why: { type: 'string', maxLength: 220 },
            },
            required: ['check', 'passed', 'why'],
          },
        },

        key_drivers: {
          type: 'array',
          minItems: 2,
          maxItems: 3,
          items: { type: 'string', maxLength: 140 },
        },
      },
      required: ['overall_result', 'scores', 'checks', 'key_drivers'],
    },

    counterfactual_outcomes: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          probability_percent: { type: 'number', minimum: 0, maximum: 100 },
          likely_recipient_response: { type: 'string', maxLength: 200 },
          why: { type: 'string', maxLength: 220 },
        },
        required: ['probability_percent', 'likely_recipient_response', 'why'],
      },
    },

    coach_review_paragraphs: {
      type: 'array',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 3,
    },

    reflections: {
      type: 'array',
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          keyword_or_phrase: { type: 'string', maxLength: 60 },
          influence: { type: 'string', maxLength: 120 },
        },
        required: ['keyword_or_phrase', 'influence'],
      },
    },

    spoken_reflections_summary: {
      type: ['string', 'null'],
      maxLength: 300,
    },

    next_step: {
      type: 'string',
      maxLength: 220,
    },
  },

  required: [
    'impact_rating_percent',
    'change_from_original_percent',
    'change_summary',
    'evaluation',
    'counterfactual_outcomes',
    'coach_review_paragraphs',
    'reflections',
    'spoken_reflections_summary',
    'next_step',
  ],
} as const
