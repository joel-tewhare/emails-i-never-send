import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTtsAudio } from '../apis/tts'
import { useEffect, useRef, useState } from 'react'
import { FinalReview } from '@/models/final-review'
import { Play, X } from 'lucide-react'
import LikelihoodBar from './LikelihoodBar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function RewriteReview() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioBlobRef = useRef<Blob | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)

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
        if (prev) {
          URL.revokeObjectURL(prev)
        }
        return URL.createObjectURL(audioBlob)
      })
    },
  })

  const handleGenerateAudio = () => {
    if (!finalReviewData?.reviewData) return
    if (audioUrl || ttsMutation.isPending) return

    const review = finalReviewData.reviewData
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

    const text = parts.join('\n\n')
    if (!text) return

    ttsMutation.mutate(text)
  }

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      audioBlobRef.current = null
    }
  }, [audioUrl])

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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-email-grey px-4 pb-12 pt-8 md:px-6 md:pb-6 md:pt-16">
      <div className="flex flex-col items-center justify-center gap-10 md:gap-6">
        <Card className="my-4 max-w-96 rounded-none border-none p-2 text-center md:my-8">
          <CardHeader className="p-2 font-serif text-8xl md:text-9xl">
            <span className="italic">Final</span> word.
          </CardHeader>
        </Card>
        <div className="mx-2 text-center md:mx-0 md:text-left">
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            You made it.
          </p>
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            With some careful revision and AI coaching, you&apos;ve hopefully
            crafted a final email that&apos;s gone from{' '}
            <span className="italic">never</span> to being{' '}
            <span className="italic">ready</span> to use in the right situation.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 px-2 md:flex-row md:flex-nowrap md:gap-0">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="tabs group graphic"
          className="my-12 hidden h-96 md:block"
        />

        <Card className="my-6 flex h-96 w-full max-w-[24rem] flex-col overflow-hidden rounded-lg bg-email-stone/70 p-4 text-email-charcoal md:mx-4 md:my-12 md:w-[24rem] md:shrink-0">
          <CardHeader className="flex flex-1 flex-col justify-between pt-8 font-serif text-lg">
            <div className="mx-auto flex w-full min-w-0 max-w-[16rem] flex-col items-center justify-center gap-4 overflow-hidden px-0 pt-8 text-center">
              {!audioUrl && !ttsMutation.isPending && (
                <Button
                  onClick={handleGenerateAudio}
                  className="flex h-auto min-w-0 max-w-full flex-col items-center gap-3 whitespace-normal bg-transparent py-0 hover:bg-transparent"
                >
                  <Play
                    className="h-16 w-16 shrink-0 text-email-charcoal"
                    aria-label="Load audio"
                  />
                  <p className="w-full min-w-0 max-w-full break-words text-3xl font-bold text-email-charcoal/90">
                    Click here to listen to your final review
                  </p>
                </Button>
              )}

              {ttsMutation.isPending && (
                <>
                  <Play
                    className="h-16 w-16 shrink-0 text-email-charcoal opacity-50"
                    aria-label="Loading audio"
                  />
                  <span className="w-full min-w-0 max-w-full break-words text-2xl text-email-charcoal/80 md:text-3xl">
                    Loading review audio…
                  </span>
                </>
              )}

              {ttsMutation.isError && !ttsMutation.isPending && (
                <div className="flex w-full min-w-0 flex-col items-center gap-4">
                  <span className="w-full min-w-0 max-w-full break-words text-2xl text-email-charcoal md:text-3xl">
                    Couldn&apos;t generate audio. See review notes below
                  </span>
                </div>
              )}

              {audioUrl && !ttsMutation.isPending && (
                <>
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center text-email-charcoal"
                    aria-hidden
                  >
                    <Play className="h-16 w-16" />
                  </div>
                  <span className="w-full min-w-0 max-w-full break-words text-2xl font-bold text-email-charcoal md:text-3xl">
                    <span className="italic">Listen</span> to your final review:
                  </span>
                </>
              )}
            </div>
            {audioUrl && (
              <div className="mt-auto pt-4">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                  onError={handleAudioError}
                />
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      {impactRating !== null && (
        <div className="mx-4 my-10 flex w-full min-w-0 max-w-2xl flex-col items-center justify-center gap-6 md:m-10 md:my-6 md:gap-2 md:px-0">
          <div className="flex w-full min-w-0 max-w-[38rem] flex-col items-center gap-4 px-2 md:flex-row md:gap-2 md:px-0">
            <Card className="mb-4 shrink-0 rounded-none border-none">
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
              <p className="text-md min-w-0 flex-1 text-center text-email-charcoal/80 md:text-left">
                {ratingChangeExplanation}
              </p>
            )}
          </div>

          <Card className="w-full max-w-2xl rounded-lg border-2 border-dashed border-email-charcoal p-4 text-email-charcoal md:p-2">
            <CardHeader className="p-2 text-center text-lg">
              <CardTitle className="text-2xl">
                If you sent this email...
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {counterfactualOutcomes.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-email-charcoal/90">
                    How likely:
                  </p>
                  {counterfactualOutcomes.map((outcome, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-start gap-4"
                    >
                      <div className="shrink-0">
                        <LikelihoodBar value={outcome.probabilityPercent} />
                      </div>
                      <p className="min-w-0 flex-1 break-words text-left text-sm italic leading-relaxed text-email-charcoal/80">
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

      <div className="mx-4 my-10 flex w-full max-w-6xl flex-col items-center gap-6 px-2 md:relative md:mx-auto md:my-4 md:items-stretch md:gap-4 md:px-0">
        {/* Right column first so its content height sets the row height on desktop */}
        <Card className="order-2 m-4 flex w-full min-w-0 max-w-xl flex-1 flex-col rounded-none border-none bg-email-grey px-4 py-6 text-email-charcoal md:ml-[calc(50%+0.5rem)] md:w-[calc(50%-1.5rem)] md:max-w-none md:pl-12 md:pr-12">
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
        <Card className="order-1 m-4 flex min-h-0 w-full min-w-0 max-w-xl flex-1 flex-col overflow-hidden rounded-lg bg-email-stone/70 text-email-charcoal md:absolute md:bottom-4 md:left-4 md:top-4 md:w-[calc(50%-0.5rem)] md:max-w-none md:flex-none">
          <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-0 pt-0">
            <Tabs
              defaultValue="evaluation"
              className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden px-3"
            >
              <TabsList className="grid w-full shrink-0 grid-cols-2 gap-2 bg-transparent p-3 md:grid-cols-3 md:gap-0">
                <TabsTrigger
                  value="evaluation"
                  className="rounded-md border border-input bg-white/80 p-2 text-center text-email-charcoal shadow-sm transition-colors hover:border-email-charcoal/70 hover:bg-email-charcoal/90 hover:text-email-white data-[state=active]:border-email-charcoal/70 data-[state=active]:bg-email-charcoal/90 data-[state=active]:font-bold data-[state=active]:text-email-white"
                >
                  Evaluation
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-md border border-input bg-white/80 p-2 text-center text-email-charcoal shadow-sm transition-colors hover:border-email-charcoal/70 hover:bg-email-charcoal/90 hover:text-email-white data-[state=active]:border-email-charcoal/70 data-[state=active]:bg-email-charcoal/90 data-[state=active]:font-bold data-[state=active]:text-email-white"
                >
                  Review Notes
                </TabsTrigger>
                <TabsTrigger
                  value="takeaways"
                  className="col-span-2 rounded-md border border-input bg-white/80 p-2 text-center text-email-charcoal shadow-sm transition-colors hover:border-email-charcoal/70 hover:bg-email-charcoal/90 hover:text-email-white data-[state=active]:border-email-charcoal/70 data-[state=active]:bg-email-charcoal/90 data-[state=active]:font-bold data-[state=active]:text-email-white md:col-span-1"
                >
                  Final Takeaways
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="evaluation"
                className="mb-12 mt-24 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden md:mt-8"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4 pt-2 text-sm">
                  {evaluation ? (
                    <div className="space-y-6">
                      <div className="inline-block rounded-lg bg-email-white px-4 py-3 text-left font-serif text-lg">
                        <span className="text-email-charcoal">Result: </span>
                        <span
                          className={
                            evaluation.overallResult === 'pass'
                              ? 'text-green-700'
                              : 'text-amber-700'
                          }
                        >
                          {evaluation.overallResult === 'pass'
                            ? 'Pass'
                            : 'Needs work'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 pl-4">
                        <ul className="list-none space-y-0.5 text-sm text-email-charcoal/90">
                          <li>
                            <span className="font-bold">Clarity:</span>{' '}
                            {evaluation.scores.clarity}%
                          </li>
                          <li>
                            <span className="font-bold">Tone:</span>{' '}
                            {evaluation.scores.toneRespect}%
                          </li>
                          <li>
                            <span className="font-bold">Directness:</span>{' '}
                            {evaluation.scores.directness}%
                          </li>
                          <li>
                            <span className="font-bold">Efficiency:</span>{' '}
                            {evaluation.scores.efficiency}%
                          </li>
                        </ul>
                      </div>
                      {evaluation.checks?.length > 0 && (
                        <div className="rounded-lg border border-solid border-email-charcoal bg-email-white p-5">
                          <ul className="space-y-2">
                            {evaluation.checks.map((c, i) => (
                              <li key={i}>
                                <span
                                  className={
                                    c.passed
                                      ? 'font-serif text-green-700'
                                      : 'font-serif text-amber-700'
                                  }
                                >
                                  {c.passed ? '✓' : '✗'}
                                </span>{' '}
                                <span className="font-serif">{c.check}</span>
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
                          <span className="block text-center font-semibold">
                            Key drivers:
                          </span>
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
                className="mb-12 mt-24 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4 pt-2 text-sm leading-relaxed">
                  {reviewParagraphs.map((para, index) => (
                    <p key={index} className="mb-3">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent
                value="takeaways"
                className="mb-12 mt-24 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-3 px-4 pt-2">
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

      {/* Save Email Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-email-grey/80 backdrop-blur-sm">
          <Card className="relative max-w-md rounded-none border-2 border-email-charcoal bg-email-white p-6">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute right-4 top-4 text-email-charcoal hover:text-email-charcoal/70"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Save Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-email-charcoal">This is a future feature.</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-12 mt-10 flex flex-row flex-wrap justify-center gap-6 px-4 md:mt-8 md:justify-start md:gap-4 md:px-0">
        <Button
          onClick={() => setShowSaveModal(true)}
          className="flex h-14 items-center justify-center rounded-xl bg-email-charcoal px-6 text-lg font-semibold text-email-white shadow-md transition-colors duration-150 hover:bg-email-charcoal/80 hover:shadow-md active:bg-email-white/20"
        >
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
