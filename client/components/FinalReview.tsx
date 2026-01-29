import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTtsAudio } from '../apis/tts'
import { useEffect, useRef, useState } from 'react'
import { FinalReview } from '@/models/final-review'
import { AudioLines } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioBlobRef = useRef<Blob | null>(null)

  const queryClient = useQueryClient()

  //Retrieves final email data from query cache. Keeps data fresh
  const { data: finalReviewData } = useQuery<FinalReview>({
    queryKey: ['finalReview'],
    queryFn: () => {
      const cachedData = queryClient.getQueryData<FinalReview>(['finalReview'])
      if (cachedData) {
        return cachedData
      }

      const storedData = localStorage.getItem('finalReview')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as FinalReview
          // Update cache for future use
          queryClient.setQueryData(['finalReview'], parsedData)
          return parsedData
        } catch (error) {
          console.error('Error parsing stored final review data:', error)
          localStorage.removeItem('finalReview')
          throw new Error('Failed to parse stored review data')
        }
      }

      throw new Error('No final review data found')
    },
    staleTime: Infinity,
    retry: false, // Don't retry if data is missing
  })

  const ttsMutation = useMutation({
    mutationFn: (text: string) => generateTtsAudio(text),
    onSuccess: (audioBlob) => {
      audioBlobRef.current = audioBlob
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(audioBlob)
      })
    },
  })

  useEffect(() => {
    const review = finalReviewData?.reviewData
    if (!review) return

    const paragraphs = review.coachReviewParagraphs ?? []
    const reflections = review.spokenReflectionsSummary?.trim()
    const nextStep = review.nextStep?.trim()

    const parts: string[] = []

    if (paragraphs.length > 0) {
      parts.push(paragraphs.join('\n\n'))
    }

    if (reflections) {
      parts.push(reflections)
    }

    if (nextStep) {
      parts.push(nextStep)
    }

    const mainReviewText = parts.join('\n\n')

    if (!mainReviewText) return //text doesn't exist
    if (audioUrl) return //audio is already generated
    if (ttsMutation.isPending) return //audio is being generating

    ttsMutation.mutate(mainReviewText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    finalReviewData?.reviewData?.coachReviewParagraphs,
    finalReviewData?.reviewData?.nextStep,
    finalReviewData?.reviewData?.spokenReflectionsSummary,
    audioUrl,
    ttsMutation.isPending,
  ])

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      audioBlobRef.current = null
    }
  }, [audioUrl])

  const handlePlayTts = () => {
    if (!audioRef.current) return
    audioRef.current.play()
  }

  const handleAudioError = () => {
    const blob = audioBlobRef.current
    if (blob && audioUrl) {
      URL.revokeObjectURL(audioUrl)
      const newUrl = URL.createObjectURL(blob)
      setAudioUrl(newUrl)
      setTimeout(() => audioRef.current?.load(), 0)
    }
  }

  const reviewParagraphs =
    finalReviewData?.reviewData?.coachReviewParagraphs ?? []
  const reflections = finalReviewData?.reviewData?.reflections ?? []
  const impactRating = finalReviewData?.reviewData?.impactRatingPercent
  const ratingChange = finalReviewData?.reviewData?.changeFromOriginalPercent
  const ratingChangeExplanation = finalReviewData?.reviewData?.changeSummary
  const counterfactualOutcomes =
    finalReviewData?.reviewData?.counterfactualOutcomes ?? []
  const evaluation = finalReviewData?.reviewData?.evaluation

  const changeLabel = () => {
    if (ratingChange === null || ratingChange === undefined) {
      return 'no change'
    } else if (ratingChange > 0) {
      return `up ${ratingChange}%`
    } else if (ratingChange < 0) {
      return `down ${Math.abs(ratingChange)}%`
    }
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Card className="my-8 max-w-96 rounded-none border-none p-2 text-center">
          <CardHeader className="p-2 font-serif text-8xl md:text-9xl">
            <span className="italic">Final</span> word.
          </CardHeader>
        </Card>
        <div className="mx-6 md:mx-0">
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            You made it.
          </p>
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            With some careful revision and AI coaching, you&apos;ve hopefully
            crafted a final email that&apos;s gone from{' '}
            <span className="italic">never</span> to being{' '}
            <span className="italic">ready</span> to send in the right
            situation.
          </p>
        </div>
      </div>

      <div className="flex flex-row">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="tabs group graphic"
          className="my-12 h-96"
        />

        <Card className="mx-4 my-12 h-96 w-96 rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
          <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
            <CardTitle className="mb-10 mt-8 text-center">
              {!audioUrl && ttsMutation.isPending && (
                <span className="text-3xl text-email-charcoal/80">
                  Loading review audio…
                </span>
              )}

              {!audioUrl && ttsMutation.isError && (
                <span className="text-3xl text-email-charcoal">
                  Couldn&apos;t generate audio. See review notes below
                </span>
              )}

              {audioUrl && (
                <span className="mx-1 text-3xl text-email-charcoal">
                  <span className="italic">Listen</span> to your final review:
                </span>
              )}
            </CardTitle>
            <div className="flex flex-col items-center gap-4 pb-4">
              {ttsMutation.isPending && (
                <button
                  disabled
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal opacity-50"
                  aria-label="Loading audio"
                >
                  <span className="text-lg font-bold">...</span>
                </button>
              )}

              {ttsMutation.isError && !ttsMutation.isPending && (
                <div className="flex items-center justify-center px-4 text-center text-sm text-email-charcoal/70">
                  Audio unavailable at this time (Gemini tier limits)
                </div>
              )}

              {audioUrl && !ttsMutation.isPending && (
                <button
                  onClick={handlePlayTts}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal hover:bg-email-white/80"
                  aria-label="Play audio review"
                >
                  <AudioLines
                    className="my-6 h-16 w-16"
                    fill="email-charcoal"
                  />
                </button>
              )}
              {audioUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                  onError={handleAudioError}
                />
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      {impactRating !== null && audioUrl && (
        <div className="m-10 flex w-full flex-col items-center justify-center gap-1">
          <div className="flex flex-row items-center justify-center gap-4">
            <Card className="mb-8 max-w-xl rounded-none border-none">
              <CardHeader className="pl-3 pt-2 text-2xl font-bold">
                <CardTitle>Impact Rating:</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pl-3 pt-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-8xl font-bold">{impactRating}%</div>
                  <p className="text-md font-bold text-email-charcoal/80">
                    {changeLabel()}
                  </p>
                </div>
              </CardContent>
            </Card>
            {ratingChangeExplanation && (
              <p className="text-md m-1 text-right text-email-charcoal/80 md:max-w-md">
                {ratingChangeExplanation}
              </p>
            )}
          </div>

          <Card className="w-full max-w-2xl rounded-none border-none p-4 text-email-charcoal md:p-2">
            <CardHeader className="p-2 text-center text-lg">
              <CardTitle className="text-2xl">
                If you sent this email...
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {counterfactualOutcomes.length > 0 ? (
                <div className="space-y-4">
                  {counterfactualOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-24 shrink-0">
                        <div className="text-4xl font-bold leading-none">
                          {outcome.probabilityPercent}%
                        </div>
                        <div className="mt-1 text-center text-xs font-semibold text-email-charcoal/90">
                          likely
                        </div>
                      </div>

                      <p className="text-left text-sm italic leading-relaxed text-email-charcoal/80">
                        {outcome.likelyRecipientResponse}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-email-charcoal/60">
                  No outcome simulation available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mx-4 my-4 flex w-full max-w-6xl flex-col gap-4 md:relative md:mx-auto">
        {/* Right column first so its content height sets the row height on desktop */}
        <Card className="order-2 m-4 flex flex-1 flex-col rounded-none border-none bg-email-white py-6 pl-12 pr-12 text-email-charcoal md:ml-[calc(50%+0.5rem)] md:w-[calc(50%-1.5rem)]">
          <CardHeader className="shrink-0 justify-center p-0 font-serif text-lg">
            <CardTitle className="mb-3 mt-0 max-w-48 border-2 border-email-charcoal p-2 text-center font-serif">
              Your Final Email
            </CardTitle>
          </CardHeader>
          <div className="min-w-0 whitespace-pre-line text-sm leading-relaxed">
            {finalReviewData?.finalEmail}
          </div>
        </Card>
        {/* Left column: absolute on md so it matches right column height; half width */}
        <Card className="order-1 m-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-2 border-dashed border-email-charcoal bg-email-white text-email-charcoal md:absolute md:bottom-4 md:left-4 md:top-4 md:w-[calc(50%-0.5rem)] md:flex-none">
          <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0 pt-0">
            <Tabs
              defaultValue="evaluation"
              className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden px-3"
            >
              <TabsList className="grid w-full shrink-0 grid-cols-3 gap-0 p-3">
                <TabsTrigger
                  value="evaluation"
                  className="bg-email-white p-2 text-center text-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  Evaluation
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="bg-email-white p-2 text-center text-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  Review Notes
                </TabsTrigger>
                <TabsTrigger
                  value="takeaways"
                  className="bg-email-white p-2 text-center text-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  Final Takeaways
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="evaluation"
                className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4 text-sm">
                  {evaluation ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">Result:</span>
                        <span
                          className={
                            evaluation.overallResult === 'pass'
                              ? 'font-medium text-green-700'
                              : 'font-medium text-amber-700'
                          }
                        >
                          {evaluation.overallResult === 'pass'
                            ? 'Pass'
                            : 'Needs work'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">Scores:</span>
                        <ul className="list-none space-y-0.5 text-email-charcoal/90">
                          <li>Clarity: {evaluation.scores.clarity}%</li>
                          <li>Tone: {evaluation.scores.toneRespect}%</li>
                          <li>Directness: {evaluation.scores.directness}%</li>
                          <li>Efficiency: {evaluation.scores.efficiency}%</li>
                        </ul>
                      </div>
                      {evaluation.checks?.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Checks:</span>
                          <ul className="space-y-2">
                            {evaluation.checks.map((c, i) => (
                              <li
                                key={i}
                                className="border-l-2 border-email-charcoal/20 pl-2"
                              >
                                <span
                                  className={
                                    c.passed
                                      ? 'text-green-700'
                                      : 'text-amber-700'
                                  }
                                >
                                  {c.passed ? '✓' : '✗'}
                                </span>{' '}
                                {c.check}
                                <p className="mt-0.5 text-xs text-email-charcoal/70">
                                  {c.why}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {evaluation.keyDrivers?.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">Key drivers:</span>
                          <ul className="list-disc space-y-0.5 pl-4 text-email-charcoal/90">
                            {evaluation.keyDrivers.map((driver, i) => (
                              <li key={i}>{driver}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-email-charcoal/60">
                      No evaluation available.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="notes"
                className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4 text-sm leading-relaxed">
                  {reviewParagraphs.map((para, index) => (
                    <p key={index} className="mb-3">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="takeaways"
                className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4">
                  {reflections.length > 0 ? (
                    <div className="space-y-4 text-sm leading-relaxed">
                      {reflections.map((reflection, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-email-charcoal/20 pl-2"
                        >
                          <p className="mb-1 font-semibold italic">
                            You wrote:
                          </p>
                          <p className="mb-2 mb-6 italic text-email-charcoal/70">
                            {reflection.keywordOrPhrase}
                          </p>
                          <p className="mb-1 font-semibold underline">
                            How it influences the reader:
                          </p>
                          <p className="mb-2">{reflection.influence}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-email-charcoal/60">
                      No reflections available.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12 mt-8 flex flex-row gap-4">
        <Button className="flex h-14 items-center justify-center rounded-xl bg-email-charcoal px-6 text-lg font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 hover:shadow-md active:bg-email-white/20">
          Save Email
        </Button>

        <Button
          asChild
          className="flex h-14 items-center justify-center rounded-xl bg-email-charcoal px-6 text-lg font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 hover:shadow-md active:bg-email-white/20"
        >
          <Link to="/compose">Start New Email</Link>
        </Button>
      </div>
    </div>
  )
}
