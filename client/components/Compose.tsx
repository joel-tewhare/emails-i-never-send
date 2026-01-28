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
import { useState, useRef, ChangeEvent } from 'react'
import { usePrompt } from '../hooks/usePrompt'
import { getEmailReview } from '../apis/email-review'
import { useNavigate } from 'react-router'
import VoiceNote from './VoiceNote'
import { SetupAnswers } from '@/models/setup'

export const SESSION_STARTER = {
  priority: [
    'Being clear, even if it feels firm',
    'Preserving warmth, even if some things stay unsaid',
  ],
  avoid: [
    'Being misunderstood',
    'Sounding defensive',
    'Escalating tension',
    'Creating false expectations',
  ],
  tone: [
    'Calm and steady',
    'Direct and pragmatic',
    'Careful and considerate',
    'Honest but restrained',
  ],
} as const

const groundingDocPlaceholder =
  'e.g. I want the language to sound like how I normally speak.'
const groundingDocMaxLength = 300

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
  const [voiceNoteKey, setVoiceNoteKey] = useState(0)
  const [setupAnswers, setSetupAnswers] = useState<SetupAnswers | null>(null)
  const [groundingDoc, setGroundingDoc] = useState<string | null>(null)
  const [showSessionStarter, setShowSessionStarter] = useState(true)
  const [sessionStarterPriority, setSessionStarterPriority] = useState('')
  const [sessionStarterAvoid, setSessionStarterAvoid] = useState('')
  const [sessionStarterTone, setSessionStarterTone] = useState('')

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

  const handleEmailContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
  const promptSectionRef = useRef<HTMLDivElement>(null)

  const reviewMutation = useMutation({
    mutationFn: ({
      emailContent,
      promptText,
      audioBlob,
      wordLimit,
      setupAnswers,
      groundingDoc,
    }: {
      emailContent: string
      promptText: string
      audioBlob: Blob | null
      wordLimit: number
      setupAnswers: SetupAnswers | null
      groundingDoc: string | null
    }) =>
      getEmailReview(
        emailContent,
        promptText,
        audioBlob,
        wordLimit,
        setupAnswers,
        groundingDoc,
      ),
    onSuccess: (data) => {
      // Store review result in query cache for persistence
      queryClient.setQueryData(['emailReview'], data)

      // Store in local storage to access if page is refreshed
      localStorage.setItem('emailReview', JSON.stringify(data))
      window.scrollTo(0, 0)
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
          promptSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        setupAnswers,
        groundingDoc,
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

  const isReviewPending = reviewMutation.isPending

  return (
    <div className="relative min-h-screen w-full bg-email-grey p-4">
      {isReviewPending && (
        <div className="fixed absolute inset-0 inset-0 z-50 flex flex items-center justify-center bg-email-grey/60 backdrop-blur-sm">
          <p className="text-email-charcoal">Preparing your review...</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        {/* Session Starter row */}
        {showSessionStarter && (
          <div className="mx-auto mb-8 w-full max-w-6xl">
            <div className="flex min-h-[340px] flex-col gap-6 rounded-lg bg-email-charcoal/10 px-6 py-8">
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
                {/* Column 1: title and skip */}
                <div className="flex flex-col items-center justify-center text-center md:flex-[1.25]">
                  <h2 className="font-serif text-xl font-bold text-email-charcoal md:text-2xl">
                    Session Starter
                  </h2>
                  <p className="mt-2 text-sm text-email-charcoal/80">
                    A moment to think about how you want to approach this
                    session
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSessionStarterPriority('')
                      setSessionStarterAvoid('')
                      setSessionStarterTone('')
                      setSetupAnswers(null)
                      setShowSessionStarter(false)
                    }}
                    className="mt-3 text-sm text-email-charcoal/70 underline underline-offset-2 hover:text-email-charcoal"
                  >
                    Skip for now
                  </button>
                </div>
                {/* Column 2: Priority */}
                <div className="flex flex-1 flex-col space-y-3">
                  <Label className="font-semibold text-email-charcoal">
                    What are you prioritising most going into this session?
                  </Label>
                  <div className="flex flex-col space-y-2">
                    {SESSION_STARTER.priority.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSessionStarterPriority(opt)}
                        className={`w-full rounded-md border border-input px-3 py-2.5 text-left text-sm shadow-sm transition-colors hover:border-email-charcoal/70 ${
                          sessionStarterPriority === opt
                            ? 'bg-email-mint text-email-charcoal'
                            : sessionStarterPriority
                              ? 'bg-white/90 text-email-charcoal/50'
                              : 'bg-white/80 text-email-charcoal hover:bg-white/90 hover:text-email-charcoal/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Column 3: Avoid */}
                <div className="flex flex-1 flex-col space-y-3">
                  <Label className="font-semibold text-email-charcoal">
                    What are you most trying to avoid this session?
                  </Label>
                  <div className="flex flex-col space-y-2">
                    {SESSION_STARTER.avoid.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSessionStarterAvoid(opt)}
                        className={`w-full rounded-md border border-input px-3 py-2.5 text-left text-sm shadow-sm transition-colors hover:border-email-charcoal/70 ${
                          sessionStarterAvoid === opt
                            ? 'bg-email-mint text-email-charcoal'
                            : sessionStarterAvoid
                              ? 'bg-white/90 text-email-charcoal/50'
                              : 'bg-white/80 text-email-charcoal hover:bg-white/90 hover:text-email-charcoal/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Column 4: Tone */}
                <div className="flex flex-1 flex-col space-y-3">
                  <Label className="font-semibold text-email-charcoal">
                    What tone are you focusing on this session?
                  </Label>
                  <div className="flex flex-col space-y-2">
                    {SESSION_STARTER.tone.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSessionStarterTone(opt)}
                        className={`w-full rounded-md border border-input px-3 py-2.5 text-left text-sm shadow-sm transition-colors hover:border-email-charcoal/70 ${
                          sessionStarterTone === opt
                            ? 'bg-email-mint text-email-charcoal'
                            : sessionStarterTone
                              ? 'bg-white/90 text-email-charcoal/50'
                              : 'bg-white/80 text-email-charcoal hover:bg-white/90 hover:text-email-charcoal/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Grounding doc: width of 2nd–3rd columns, centred */}
                <div className="flex flex-col space-y-2 pt-2 md:col-span-2 md:col-start-2">
                  <Label className="font-semibold text-email-charcoal">
                    Anything else you want your coach to keep in mind while
                    reviewing
                  </Label>
                  <Textarea
                    value={groundingDoc ?? ''}
                    onChange={(e) => setGroundingDoc(e.target.value || null)}
                    placeholder={groundingDocPlaceholder}
                    maxLength={groundingDocMaxLength}
                    className="min-h-10 w-full resize-y bg-email-white px-3 py-2.5 text-sm"
                  />
                </div>
                {/* Submit at end of row, corner of section */}
                <div className="flex items-end justify-end pt-2 md:col-span-1 md:col-start-4">
                  <Button
                    type="button"
                    onClick={() => {
                      if (
                        !sessionStarterPriority &&
                        !sessionStarterAvoid &&
                        !sessionStarterTone
                      ) {
                        setSetupAnswers(null)
                      } else {
                        setSetupAnswers({
                          priority: {
                            choice: sessionStarterPriority || '',
                          },
                          avoid: { choice: sessionStarterAvoid || '' },
                          tone: { choice: sessionStarterTone || '' },
                        })
                      }
                      setShowSessionStarter(false)
                    }}
                    className="rounded-xl bg-email-charcoal px-6 text-email-white hover:bg-email-charcoal/90"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Big header */}
        <Card className="my-8 max-w-72 rounded-none border-none p-2 text-center">
          <CardHeader className="p-2 font-serif text-8xl md:text-9xl">
            Let&apos;s <span className="italic">write.</span>
          </CardHeader>
        </Card>

        {/* Three rows of options */}
        <div className="mx-auto mb-6 flex w-full max-w-6xl flex-col items-center space-y-6">
          {/* First row: Text box on left, Scenario and Mood on right */}
          <div className="flex w-full flex-col flex-wrap items-center justify-center gap-12 md:flex-row">
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="max-w-72 text-center text-2xl font-bold md:text-right">
                Set the scene for your writing your email.
              </p>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-center gap-8 md:flex-row">
              <div className="flex flex-col items-center space-y-4">
                <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-blue p-4">
                  <CardHeader>
                    <CardTitle>
                      <img
                        src="/assets/icons/scenarios.svg"
                        alt="scenario icons"
                        className="h-16"
                      />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-2">
                  <Label className="font-serif text-lg">
                    Choose a Scenario
                  </Label>
                  <Select
                    value={
                      selectedScenarioId
                        ? String(selectedScenarioId)
                        : undefined
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
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-mauve p-4">
                  <CardTitle className="p-10">
                    <img
                      src="/assets/icons/prompt-moods.svg"
                      alt="mood icons"
                      className="h-16"
                    />
                  </CardTitle>
                </Card>
                <div className="space-y-2">
                  <Label className="font-serif text-lg">Select Mood</Label>
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
              </div>
            </div>
          </div>

          {/* Second row: Text box on left, Word Limit and Time Limit on right */}
          <div className="flex w-full flex-col flex-wrap items-center justify-center gap-12 md:flex-row">
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="max-w-72 text-center text-2xl font-bold md:text-right">
                Set your preferred writing conditions.
              </p>
            </div>
            <div className="flex flex-col flex-wrap items-center justify-center gap-8 md:flex-row">
              <div className="flex flex-col items-center space-y-4">
                <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-gold p-4">
                  <CardHeader>
                    <CardTitle>
                      <img
                        src="/assets/icons/word-limit.png"
                        alt="notepad icon"
                        className="h-16"
                      />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-2">
                  <Label className="font-serif text-lg">Word Limit</Label>
                  <Select
                    value={
                      selectedWordLimitId
                        ? String(selectedWordLimitId)
                        : undefined
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
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Card className="flex h-20 w-64 items-center justify-center border border-email-charcoal bg-email-gold p-4">
                  <CardHeader>
                    <CardTitle>
                      <img
                        src="/assets/icons/time-limit.png"
                        alt="stopwatch icon"
                        className="h-16"
                      />
                    </CardTitle>
                  </CardHeader>
                </Card>
                <div className="space-y-2">
                  <Label className="font-serif text-lg">Time Limit</Label>
                  <Select
                    value={
                      selectedTimeLimitId
                        ? String(selectedTimeLimitId)
                        : undefined
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
              </div>
            </div>
          </div>

          {/* Third row: Get Prompt button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGetPrompt}
              disabled={
                !selectedScenarioId ||
                !selectedMoodId ||
                isPendingPrompts ||
                !selectedWordLimitId ||
                !selectedTimeLimitId
              }
              className="m-4 flex items-center justify-center rounded-xl bg-email-charcoal px-6 py-7 text-xl font-semibold text-email-white hover:shadow-md disabled:opacity-50"
            >
              {isPendingPrompts || !selectedWordLimit || !selectedTimeLimitId
                ? 'Choose Options'
                : 'Get Prompt'}
            </Button>
          </div>
        </div>

        {/* Centered column: Prompt section down to Get Review button */}
        <div
          ref={promptSectionRef}
          className="mx-auto mt-8 flex w-full max-w-xl scroll-mt-4 flex-col items-center"
        >
          <Card className="mb-4 w-full border-none p-3">
            <CardHeader className="mb-4 w-60 border-2 border-email-charcoal p-2 text-center font-serif">
              <CardTitle className="text-xl">
                Here&apos;s your prompt:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-md pb-3 pl-3 pt-2 font-sans">
              {selectedPrompt ||
                'Choose from the options above then click "Get Prompt" to start.'}
            </CardContent>
          </Card>

          <Textarea
            value={emailContent}
            onChange={handleEmailContentChange}
            className="h-80 w-full border-2 border-email-charcoal px-3 py-3 text-sm"
            placeholder="Start writing your email here..."
          />

          <Card className="w-full rounded-none border-none">
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

          <VoiceNote
            key={voiceNoteKey}
            onAudioRecorded={(blob) => setAudioBlob(blob)}
            onReRecord={() => {
              setAudioBlob(null)
              setVoiceNoteKey((prev) => prev + 1)
            }}
          />

          <Card className="h-16 w-full border-none">
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
