import { useQuery } from '@tanstack/react-query'
import { getPrompts } from '../apis/prompts'

export function usePrompt(scenarioId: number | null, moodId: number | null) {
  return useQuery({
    queryKey: ['prompts', scenarioId, moodId],
    queryFn: () => {
      if (!scenarioId || !moodId) {
        throw new Error('scenarioId and moodId are required')
      }
      return getPrompts(scenarioId, moodId)
    },
    enabled: Boolean(scenarioId && moodId),
  })
}
