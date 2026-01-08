import { useQuery } from '@tanstack/react-query'
import { getPrompts } from '../apis/prompts'

/**
 * Custom hook to fetch prompts based on scenario and mood
 * Only fetches when both scenarioId and moodId are provided
 * Uses React Query caching - same params = cached result
 */
export function usePrompt(scenarioId: number | null, moodId: number | null) {
  return useQuery({
    queryKey: ['prompts', scenarioId, moodId],
    queryFn: () => {
      if (!scenarioId || !moodId) {
        throw new Error('scenarioId and moodId are required')
      }
      return getPrompts(scenarioId, moodId)
    },
    enabled: Boolean(scenarioId && moodId), // Only fetch when both are selected
  })
}
