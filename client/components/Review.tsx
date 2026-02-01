import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmailReview } from '@/models/email-review'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { getFinalReview } from '../apis/final-review'
import { generateTtsAudio } from '../apis/tts'
import { Mail, Pencil, Play } from 'lucide-react'
import LikelihoodBar from './LikelihoodBar'
import LoadingBars from './LoadingBars'
import {
  getWordCount,
  getWordsRemaining,
  isWordLimitReached,
} from '@/lib/utils'

export default function Review() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [emailRewrite, setEmailRewrite] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioBlobRef = useRef<Blob | null>(null)
  const loadingElementRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  //Retrieves email data from query cache or localStorage. Keeps data fresh
  const { data: emailReviewData } = useQuery<EmailReview>({
    queryKey: ['emailReview'],
    queryFn: () => {
      const cachedData = queryClient.getQueryData<EmailReview>(['emailReview'])
      if (cachedData) {
        return cachedData
      }

      const storedData = localStorage.getItem('emailReview')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as EmailReview
          // Update cache for future use
          queryClient.setQueryData(['emailReview'], parsedData)
          return parsedData
        } catch (error) {
          console.error('Error parsing stored email review data:', error)
          localStorage.removeItem('emailReview')
          throw new Error('Failed to parse stored review data')
        }
      }

      throw new Error('No review data found')
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
    if (!emailReviewData?.reviewData) return
    if (audioUrl || ttsMutation.isPending) return

    const review = emailReviewData.reviewData
    const parts: string[] = []

    if (review.coachReviewParagraphs?.length) {
      parts.push(review.coachReviewParagraphs.join('\n\n'))
    }

    if (review.spokenLeveragePointsSummary) {
      parts.push(review.spokenLeveragePointsSummary.trim())
    }

    if (review.nextStep) {
      parts.push(review.nextStep.trim())
    }

    const text = parts.join('\n\n')
    if (!text) return

    ttsMutation.mutate(text)
  }

  const handleEmailRewriteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value
    // Prevent typing if word limit is reached
    if (
      emailReviewData?.wordLimit &&
      getWordCount(newValue) > emailReviewData.wordLimit
    ) {
      return
    }
    setEmailRewrite(newValue)
  }

  const rewriteReviewMutation = useMutation({
    mutationFn: ({
      promptText,
      originalEmailContent,
      finalEmailContent,
      originalImpactRatingPercent,
      wordLimit,
    }: {
      promptText: string
      originalEmailContent: string
      finalEmailContent: string
      originalImpactRatingPercent: number | null
      wordLimit: number
    }) =>
      getFinalReview(
        originalEmailContent,
        promptText,
        finalEmailContent,
        originalImpactRatingPercent,
        wordLimit,
      ),
    onSuccess: (data) => {
      // Store final review result in query cache for persistence
      queryClient.setQueryData(['finalReview'], data)

      // Store in local storage to access if page is refreshed
      localStorage.setItem('finalReview', JSON.stringify(data))
      navigate('/final')
    },
  })

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

  const handleRewriteReview = () => {
    if (!emailReviewData || emailRewrite.trim() === '') return

    rewriteReviewMutation.mutate({
      finalEmailContent: emailRewrite,
      promptText: emailReviewData.promptText,
      originalEmailContent: emailReviewData.emailOriginal,
      originalImpactRatingPercent: impactRating,
      wordLimit: emailReviewData.wordLimit,
    })
  }

  // Scroll loading overlay to center when pending
  useEffect(() => {
    if (rewriteReviewMutation.isPending) {
      loadingElementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [rewriteReviewMutation.isPending])

  if (!emailReviewData) {
    return <div>Missing review data</div>
  }

  const reviewData = emailReviewData.reviewData

  const reviewParagraphs = reviewData.coachReviewParagraphs ?? []
  const leveragePoints = reviewData.leveragePoints ?? []
  const counterfactualOutcomes = reviewData.counterfactualOutcomes ?? []
  const impactRating = reviewData.impactRatingPercent
  const impactDefinition = reviewData.ratingDefinition

  const originalParagraphs =
    emailReviewData.emailOriginal.split(/\n\s*\n+/) ?? []

  const isReviewPending = rewriteReviewMutation.isPending

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-email-grey px-4 pb-12 pt-8 md:p-4">
      {isReviewPending && (
        <div
          ref={loadingElementRef}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-email-grey/60 backdrop-blur-md"
        >
          <LoadingBars />
          <p className="mt-4 font-semibold text-email-charcoal">
            Sending rewrite for final review...
          </p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-10 md:gap-6">
        <Card className="my-4 max-w-96 rounded-none border-none p-2 text-center md:my-8">
          <CardHeader className="p-2 font-serif text-8xl md:text-9xl">
            Let&apos;s <span className="italic">review.</span>
          </CardHeader>
        </Card>
        <div className="mx-4 text-center md:mx-0 md:text-left">
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            Here, you can explore how your first draft might land and what
            outcomes it could create:
          </p>
          <ol className="max-w-2xl pb-12 text-left text-2xl font-bold">
            <li className="mb-4 flex items-start gap-3">
              <Play className="mt-1 h-6 w-6 shrink-0" />
              <span>Listen to key takeaways from your AI coach.</span>
            </li>
            <li className="mb-4 flex items-start gap-3">
              <Pencil className="mt-1 h-6 w-6 shrink-0" />
              <span>
                Use the review notes and reflections to help decide what your
                final email could look like.
              </span>
            </li>
            <li className="mb-4 flex items-start gap-3">
              <Mail className="mt-1 h-6 w-6 shrink-0" />
              <span>Rewrite your email and submit it for a final review.</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 px-2 md:flex-row md:flex-nowrap md:gap-4 md:px-0">
          <Card className="flex h-80 w-full max-w-[24rem] flex-col overflow-hidden rounded-lg bg-email-stone/70 p-4 text-email-charcoal md:m-8 md:w-[24rem] md:shrink-0">
            <CardHeader className="flex flex-1 flex-col justify-between pt-8 font-serif text-lg">
              <div className="mx-auto flex w-full min-w-0 max-w-[16rem] flex-col items-center justify-center gap-4 overflow-hidden px-0 pt-2 text-center">
                {!audioUrl && !ttsMutation.isPending && (
                  <Button
                    onClick={handleGenerateAudio}
                    className="flex h-auto min-w-0 max-w-full flex-col items-center gap-3 whitespace-normal bg-transparent py-0 hover:bg-transparent"
                  >
                    <Play
                      className="h-16 w-16 shrink-0 text-email-charcoal"
                      aria-label="Load audio"
                    />
                    <p className="w-full min-w-0 max-w-full break-words text-2xl font-bold text-email-charcoal/90">
                      Click here to listen to your AI coach
                    </p>
                  </Button>
                )}

                {ttsMutation.isPending && (
                  <>
                    <Play
                      className="h-16 w-16 shrink-0 text-email-charcoal opacity-50"
                      aria-label="Loading audio"
                    />
                    <span className="w-full min-w-0 max-w-full break-words text-2xl text-email-charcoal/80">
                      Loading review audio…
                    </span>
                  </>
                )}

                {ttsMutation.isError && !ttsMutation.isPending && (
                  <div className="flex w-full min-w-0 flex-col items-center gap-4">
                    <span className="w-full min-w-0 max-w-full break-words text-2xl text-email-charcoal">
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
                      Key <span className="italic">takeaways</span> from your
                      email:
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

          <Card className="h-80 w-full max-w-xl overflow-y-auto rounded-none bg-email-mint p-3 md:min-w-[20rem] md:shrink-0">
            <ScrollArea className="h-68 p-3 text-sm italic">
              <p className="mb-3 font-semibold">What you wrote:</p>
              {originalParagraphs.map((para, index) => (
                <p key={index} className="mb-3">
                  {para.trim()}
                </p>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {impactRating !== null && (
          <div className="mx-4 my-10 flex w-full min-w-0 max-w-2xl flex-col items-center justify-center gap-6 md:m-10 md:gap-2">
            <div className="flex w-full min-w-0 max-w-[38rem] flex-col items-center gap-4 px-2 md:flex-row md:gap-2 md:px-0">
              <Card className="mb-4 shrink-0 rounded-none border-none">
                <CardHeader className="pl-3 pt-2 text-2xl font-bold">
                  <CardTitle>Impact Rating:</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pl-3 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="text-8xl font-bold">{impactRating}%</div>
                  </div>
                </CardContent>
              </Card>
              {impactDefinition && (
                <p className="text-md min-w-0 flex-1 text-center text-email-charcoal/80 md:text-left">
                  {impactDefinition}
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
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-stretch md:gap-2 md:px-0">
        <div className="m-4 flex w-full max-w-md flex-col space-y-4 md:w-96 md:max-w-none">
          <Card className="h-[40rem] w-full max-w-md rounded-lg bg-email-stone/70 text-email-charcoal">
            <CardContent>
              <Tabs defaultValue="review" className="mt-0 w-full">
                <TabsList className="grid w-full grid-cols-2 gap-0 bg-transparent p-3">
                  <TabsTrigger
                    value="review"
                    className="rounded-md border border-input bg-white/80 p-2 text-center text-email-charcoal shadow-sm transition-colors hover:border-email-charcoal/70 hover:bg-email-charcoal/90 hover:text-email-white data-[state=active]:border-email-charcoal/70 data-[state=active]:bg-email-charcoal/90 data-[state=active]:font-bold data-[state=active]:text-email-white"
                  >
                    Review Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestions"
                    className="rounded-md border border-input bg-white/80 p-2 text-center text-email-charcoal shadow-sm transition-colors hover:border-email-charcoal/70 hover:bg-email-charcoal/90 hover:text-email-white data-[state=active]:border-email-charcoal/70 data-[state=active]:bg-email-charcoal/90 data-[state=active]:font-bold data-[state=active]:text-email-white"
                  >
                    Reflections
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="mt-8">
                  <ScrollArea className="h-[calc(37rem-4rem)] px-4 pt-4 text-sm leading-relaxed">
                    {reviewParagraphs.map((para, index) => (
                      <p key={index} className="mb-3">
                        {para.trim()}
                      </p>
                    ))}
                    <p>
                      Consider the reflections and what you could change then,
                      rewrite your email and submit it for a final review.
                    </p>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-8">
                  <ScrollArea className="h-[calc(39rem-4rem)] p-3 px-4 pt-2">
                    {leveragePoints.length > 0 ? (
                      <div className="space-y-4 text-sm leading-relaxed">
                        {leveragePoints.map((leveragePoint, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-email-charcoal/20 pl-2 pt-3"
                          >
                            <p className="mb-1 font-semibold italic">
                              You wrote:
                            </p>
                            <p className="mb-2 mb-6 italic text-email-charcoal/70">
                              {leveragePoint.keywordOrPhrase}
                            </p>
                            <p className="mb-1 font-semibold underline">
                              How it influences the reader:
                            </p>
                            <p className="mb-2">{leveragePoint.influence}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-email-charcoal/60">
                        No leverage points available.
                      </p>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full min-w-0 max-w-xl flex-1 flex-col items-center md:max-w-none md:items-stretch">
          <Card className="mb-8 w-full max-w-xl border-none p-3">
            <CardHeader className="mb-4 w-52 border-2 border-email-charcoal p-2 text-center font-serif">
              <CardTitle className="text-xl">
                <span className="italic">Prompt</span> reminder:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-md pb-3 pl-3 pt-2 font-sans">
              {emailReviewData.promptText}
            </CardContent>
          </Card>

          <Card className="w-full max-w-xl rounded-none bg-email-white">
            <div className="flex flex-row justify-end">
              <div className="flex flex-row items-center gap-4 pb-3 pr-4 pt-2 text-sm font-bold">
                <div className="flex flex-row items-center gap-2">
                  <img
                    src="/assets/images/word-limit.svg"
                    alt="word limit icon"
                    className="h-8 w-8"
                  />
                  {emailReviewData.wordLimit && (
                    <span>
                      {getWordsRemaining(
                        emailRewrite,
                        emailReviewData.wordLimit,
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Textarea
            value={emailRewrite}
            onChange={handleEmailRewriteChange}
            disabled={isWordLimitReached(
              emailRewrite,
              emailReviewData?.wordLimit,
            )}
            className="mb-8 h-80 w-full max-w-xl px-2 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Rewrite your email here..."
          />

          <Card className="h-16 w-full max-w-xl border-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button
                  onClick={handleRewriteReview}
                  className="flex h-14 items-center justify-center rounded-xl bg-email-mint px-6 py-5 text-lg font-bold text-email-charcoal hover:shadow-md"
                  disabled={!emailRewrite}
                >
                  Get Final Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
