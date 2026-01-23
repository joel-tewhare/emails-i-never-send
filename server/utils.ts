//Transform snake_case object keys to camelCase - useful for converting API responses (ie. from Gemini) to match TypeScript model types

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
