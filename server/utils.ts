import type { SetupAnswers } from '@/models/setup'

export default function toCamelCase(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => toCamelCase(item))
  }

  if (data === null || typeof data !== 'object') {
    return data
  }

  const obj = data as Record<string, unknown>
  const transformed: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase(),
    )

    transformed[camelKey] = toCamelCase(value)
  }

  return transformed
}

export function buildSessionContextText(
  setup?: SetupAnswers,
  groundingDoc?: string,
): string | null {
  if (!setup && !groundingDoc) return null

  const lines: string[] = []

  if (setup) {
    lines.push('SESSION SETUP (user-selected):')

    lines.push(
      `- Priority: ${setup.priority.choice}` +
        (setup.priority.other ? ` (${setup.priority.other})` : ''),
    )

    lines.push(
      `- Avoid: ${setup.avoid.choice}` +
        (setup.avoid.other ? ` (${setup.avoid.other})` : ''),
    )

    lines.push(
      `- Tone focus: ${setup.tone.choice}` +
        (setup.tone.other ? ` (${setup.tone.other})` : ''),
    )
  }

  if (groundingDoc && groundingDoc.trim()) {
    lines.push('')
    lines.push('GROUNDING DOCUMENT (user-written):')
    lines.push(groundingDoc.trim())
  }

  return lines.join('\n')
}
