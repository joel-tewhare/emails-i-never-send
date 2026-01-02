import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getScenarios } from '../apis/scenarios'
import { getMoods } from '../apis/moods'
import { getWordLimits } from '../apis/word-limits'
import { getTimeLimits } from '../apis/time-limits'
import { useState } from 'react'
import { usePrompt } from '../hooks/usePrompt'

export default function Compose() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(
    null,
  )
  const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null)
  const [selectedWordLimitId, setSelectedWordLimitId] = useState<number | null>(
    null,
  )
  const [selectedTimeLimitId, setSelectedTimeLimitId] = useState<number | null>(
    null,
  )

  const handleScenarioChange = (value: string) => {
    setSelectedScenarioId(Number(value))
  }

  const handleMoodChange = (value: string) => {
    setSelectedMoodId(Number(value))
  }

  const handleWordLimitChange = (value: string) => {
    setSelectedWordLimitId(Number(value))
  }

  const handleTimeLimitChange = (value: string) => {
    setSelectedTimeLimitId(Number(value))
  }

  const {
    data: scenariosData,
    isPending: isPendingScenarios,
    error: scenariosError,
  } = useQuery({
    queryKey: ['scenarios'],
    queryFn: getScenarios,
  })

  const {
    data: moodsData,
    isPending: isPendingMoods,
    error: moodsError,
  } = useQuery({
    queryKey: ['moods'],
    queryFn: getMoods,
  })

  const {
    data: wordLimitsData,
    isPending: isPendingWordLimits,
    error: wordLimitsError,
  } = useQuery({
    queryKey: ['wordLimits'],
    queryFn: getWordLimits,
  })

  const {
    data: timeLimitsData,
    isPending: isPendingTimeLimits,
    error: timeLimitsError,
  } = useQuery({
    queryKey: ['timeLimits'],
    queryFn: getTimeLimits,
  })

  // Custom hook for fetching prompts - only fetches when both IDs are selected
  // React Query automatically caches based on scenarioId + moodId combination
  const { isPending: isPendingPrompts, refetch: fetchPrompts } = usePrompt(
    selectedScenarioId,
    selectedMoodId,
  )

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const handleGetPrompt = async () => {
    if (selectedScenarioId && selectedMoodId) {
      try {
        const result = await fetchPrompts()
        if (result.data && result.data.length > 0) {
          // Randomly select a prompt from the array
          const randomIndex = Math.floor(Math.random() * result.data.length)
          setSelectedPrompt(result.data[randomIndex].prompt)
        }
      } catch (error) {
        console.error('Error fetching prompts:', error)
      }
    }
  }

  if (
    isPendingScenarios ||
    isPendingMoods ||
    isPendingWordLimits ||
    isPendingTimeLimits
  ) {
    return <div>Loading...</div>
  }

  if (scenariosError || moodsError || wordLimitsError || timeLimitsError) {
    return <div>Error loading data</div>
  }

  if (!scenariosData || !moodsData || !wordLimitsData || !timeLimitsData) {
    return <div>No data available</div>
  }

  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="m-4 w-full space-y-8 md:w-80">
          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
            <CardHeader>
              <CardTitle>
                <img src="/assets/icons/scenarios.svg" alt="scenario icons" />
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="space-y-2">
            <Label>Scenario</Label>
            <Select
              value={
                selectedScenarioId ? String(selectedScenarioId) : undefined
              }
              onValueChange={handleScenarioChange}
            >
              <SelectTrigger className="w-full bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {scenariosData.map((scenario) => (
                  <SelectItem
                    key={scenario.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                    value={String(scenario.id)}
                  >
                    {scenario.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-mauve p-4">
            <CardTitle className="p-10">
              <img src="/assets/icons/prompt-moods.svg" alt="mood icons" />
            </CardTitle>
          </Card>

          <div className="space-y-2">
            <Label>Mood</Label>
            <Select
              value={selectedMoodId ? String(selectedMoodId) : undefined}
              onValueChange={handleMoodChange}
            >
              <SelectTrigger className="w-full bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {moodsData.map((mood) => (
                  <SelectItem
                    key={mood.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                    value={String(mood.id)}
                  >
                    {mood.mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-gold p-4">
            <CardTitle className="p-10">
              <img
                src="/assets/icons/word-time-limits.svg"
                alt="word and time icons"
              />
            </CardTitle>
          </Card>

          <div className="space-y-2">
            <Label>Word Limit</Label>
            <Select
              value={
                selectedWordLimitId ? String(selectedWordLimitId) : undefined
              }
              onValueChange={handleWordLimitChange}
            >
              <SelectTrigger className="w-full bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {wordLimitsData.map((wordLimit) => (
                  <SelectItem
                    key={wordLimit.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                    value={String(wordLimit.id)}
                  >
                    {wordLimit.wordLimit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Limit</Label>
            <Select
              value={
                selectedTimeLimitId ? String(selectedTimeLimitId) : undefined
              }
              onValueChange={handleTimeLimitChange}
            >
              <SelectTrigger className="w-full bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {timeLimitsData.map((timeLimit) => (
                  <SelectItem
                    key={timeLimit.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal/80 hover:text-email-white"
                    value={String(timeLimit.id)}
                  >
                    {timeLimit.timeLimit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGetPrompt}
            disabled={
              !selectedScenarioId || !selectedMoodId || isPendingPrompts
            }
            className="rounded-xl bg-email-charcoal px-4 py-3 text-email-charcoal text-email-white hover:shadow-md disabled:opacity-50"
          >
            {isPendingPrompts ? 'Loading...' : 'Get Prompt'}
          </Button>
        </div>
        <div className="w-full flex-1">
          <Card className="mb-8 max-w-xl bg-email-white">
            <CardHeader className="pl-3 pt-2 font-serif">
              <CardTitle>Prompt:</CardTitle>
            </CardHeader>
            <CardContent className="font-style: pb-3 pl-3 pt-2 font-serif text-xl italic">
              {selectedPrompt ||
                'Select a scenario and mood, then click "Get Prompt" to generate a writing prompt.'}
            </CardContent>
          </Card>

          <Card className="max-w-xl rounded-none bg-email-white">
            <div className="flex flex-row justify-end">
              <CardContent className="pb-3 pl-3 pr-4 pt-2 text-sm font-bold">
                Word Limit:
              </CardContent>
              <CardContent className="pb-3 pl-3 pr-12 pt-2 text-sm font-bold">
                Timer:
              </CardContent>
            </div>
          </Card>
          <p>
            * Word Limit and Timer can be replaced with graphics in
            public/assets/images
          </p>

          <Textarea
            className="h-80 px-2 py-2 text-sm"
            placeholder="Write your email here..."
          />

          <Card className="h-16 max-w-xl rounded-none bg-email-white">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button className="rounded-xl bg-email-mint px-4 py-3 text-email-charcoal hover:shadow-md">
                  Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
