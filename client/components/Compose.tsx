import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { getEmailReview } from '../apis/email-review'
import { useNavigate } from 'react-router'
import VoiceNote from './VoiceNote'

export default function Compose() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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
  const [emailContent, setEmailContent] = useState<string>('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

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

  const handleEmailContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEmailContent(e.target.value)
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

  const reviewMutation = useMutation({
    mutationFn: ({
      emailContent,
      promptText,
      audioBlob,
      wordLimit,
    }: {
      emailContent: string
      promptText: string
      audioBlob: Blob | null
      wordLimit: number
    }) => getEmailReview(emailContent, promptText, audioBlob, wordLimit),
    onSuccess: (data) => {
      // Store review result in query cache for persistence
      queryClient.setQueryData(['emailReview'], data)
      navigate('/review')
    },
  })

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

  const handleReviewEmail = () => {
    if (selectedPrompt && emailContent !== '') {
      reviewMutation.mutate({
        emailContent,
        promptText: selectedPrompt,
        audioBlob,
        wordLimit: selectedWordLimit ?? 250,
      })
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

  const selectedWordLimit = wordLimitsData.find(
    (wordLimit) => wordLimit.id === selectedWordLimitId,
  )?.wordLimit

  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row">
        <div className="m-4 w-full space-y-8 md:w-80">
          <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
            <CardHeader>
              <CardTitle>
                <img src="/assets/icons/scenarios.svg" alt="scenario icons" />
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="space-y-2">
            <Label className="font-serif text-lg">1. Choose a Scenario</Label>
            <Select
              value={
                selectedScenarioId ? String(selectedScenarioId) : undefined
              }
              onValueChange={handleScenarioChange}
            >
              <SelectTrigger className="w-64 bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {scenariosData.map((scenario) => (
                  <SelectItem
                    key={scenario.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal hover:text-email-grey"
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
            <Label className="font-serif text-lg">2. Select Mood</Label>
            <Select
              value={selectedMoodId ? String(selectedMoodId) : undefined}
              onValueChange={handleMoodChange}
            >
              <SelectTrigger className="w-64 bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {moodsData.map((mood) => (
                  <SelectItem
                    key={mood.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal hover:text-email-grey"
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
            <Label className="font-serif text-lg">3. Set Word Limit</Label>
            <Select
              value={
                selectedWordLimitId ? String(selectedWordLimitId) : undefined
              }
              onValueChange={handleWordLimitChange}
            >
              <SelectTrigger className="w-64 bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {wordLimitsData.map((wordLimit) => (
                  <SelectItem
                    key={wordLimit.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal hover:text-email-grey"
                    value={String(wordLimit.id)}
                  >
                    {`${wordLimit.wordLimit} words`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-serif text-lg">4. Set Time Limit</Label>
            <Select
              value={
                selectedTimeLimitId ? String(selectedTimeLimitId) : undefined
              }
              onValueChange={handleTimeLimitChange}
            >
              <SelectTrigger className="w-64 bg-email-white px-2">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent className="w-64">
                {timeLimitsData.map((timeLimit) => (
                  <SelectItem
                    key={timeLimit.id}
                    className="bg-email-white px-2 py-1 hover:bg-email-charcoal hover:text-email-grey"
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
              !selectedScenarioId ||
              !selectedMoodId ||
              isPendingPrompts ||
              !selectedWordLimitId ||
              !selectedTimeLimitId
            }
            className="flex h-12 items-center justify-center rounded-xl bg-email-charcoal px-4 py-5 text-sm font-bold text-email-white hover:shadow-md disabled:opacity-50"
          >
            {isPendingPrompts ? 'Choose Options' : 'Get Prompt'}
          </Button>
        </div>
        <div className="w-full flex-1">
          <Card className="mb-4 max-w-xl border-none p-3">
            <CardHeader className="mb-4 w-60 border-2 border-email-charcoal p-2 text-center font-serif">
              <CardTitle className="text-xl">
                Here&apos;s your prompt:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-md pb-3 pl-3 pt-2 font-sans">
              {selectedPrompt ||
                'Select a scenario and mood, then click "Get Prompt" to generate a writing prompt.'}
            </CardContent>
          </Card>

          <Textarea
            value={emailContent}
            onChange={handleEmailContentChange}
            className="h-80 max-w-xl border-2 border-email-charcoal px-3 py-3 text-sm"
            placeholder="Write your email here..."
          />

          <Card className="max-w-xl rounded-none border-none">
            <div className="flex flex-row justify-end">
              <CardContent className="flex flex-row pb-3 pl-3 pr-4 pt-2 text-sm font-bold">
                <img
                  src="/assets/images/word-limit.svg"
                  alt="word limit icon"
                  className="h-9 w-9"
                />
                <p>{selectedWordLimit}</p>
              </CardContent>
              <CardContent className="flex flex-row pb-3 pl-3 pr-12 pt-2 text-sm font-bold">
                <img
                  src="/assets/images/time-limit.svg"
                  alt="timer icon"
                  className="h-9 w-9"
                />
              </CardContent>
            </div>
          </Card>

          <VoiceNote onAudioRecorded={(blob) => setAudioBlob(blob)} />

          <Card className="h-16 max-w-xl border-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button
                  onClick={handleReviewEmail}
                  className="flex h-14 items-center justify-center rounded-xl bg-email-mint px-6 py-5 text-lg font-bold text-email-charcoal hover:shadow-md"
                  disabled={!emailContent}
                >
                  Get Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
