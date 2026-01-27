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
import { AudioLines, Headphones, Mail, Pencil } from 'lucide-react'

export default function Review() {
  const [emailRewrite, setEmailRewrite] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioBlobRef = useRef<Blob | null>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleEmailRewriteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEmailRewrite(e.target.value)
  }

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

  useEffect(() => {
    const review = emailReviewData?.reviewData
    if (!review) return

    const paragraphs = review.coachReviewParagraphs ?? []
    const leveragePointsSummary = review.spokenLeveragePointsSummary?.trim()
    const nextStep = review.nextStep?.trim()

    const parts: string[] = []

    if (paragraphs.length > 0) {
      parts.push(paragraphs.join('\n\n'))
    }

    if (leveragePointsSummary) {
      parts.push(leveragePointsSummary)
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
    emailReviewData?.reviewData?.coachReviewParagraphs,
    emailReviewData?.reviewData?.nextStep,
    emailReviewData?.reviewData?.spokenLeveragePointsSummary,
    audioUrl,
    ttsMutation.isPending,
  ])

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
      queryClient.setQueryData(['finalReview'], data)
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
    <div className="relative min-h-screen w-full bg-email-grey p-4">
      {isReviewPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-email-grey/60 backdrop-blur-sm">
          <p className="text-email-charcoal">Getting your final review...</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <Card className="my-8 max-w-96 rounded-none border-none p-2 text-center">
          <CardHeader className="p-2 font-serif text-8xl md:text-9xl">
            Let&apos;s <span className="italic">review.</span>
          </CardHeader>
        </Card>
        <div className="mx-6 md:mx-0">
          <p className="max-w-2xl pb-12 text-center text-2xl font-bold">
            You&apos;ve got a great set of tools to help you review your first
            draft and simulate outcomes:
          </p>
          <ol className="max-w-2xl pb-12 text-left text-2xl font-bold">
            <li className="mb-4 flex items-start gap-3">
              <Headphones className="mt-1 h-6 w-6 shrink-0" />
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

        <div className="flex flex-row flex-wrap items-center justify-center">
          <Card className="m-8 h-80 max-w-sm rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle className="mb-10 p-1 text-center">
                {!audioUrl && ttsMutation.isPending && (
                  <span className="text-2xl text-email-charcoal/80">
                    Loading review audio…
                  </span>
                )}

                {!audioUrl && ttsMutation.isError && (
                  <span className="text-2xl text-email-charcoal">
                    Couldn&apos;t generate audio. See review notes below
                  </span>
                )}

                {audioUrl && (
                  <span className="mx-1 text-3xl text-email-charcoal">
                    Key <span className="italic">takeaways</span> from your
                    email:
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
                  <div className="flex items-center justify-center px-16 text-center text-sm text-email-charcoal/70">
                    Audio unavailable at this time (Gemini tier limits)
                  </div>
                )}

                {audioUrl && !ttsMutation.isPending && (
                  <button
                    onClick={handlePlayTts}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal hover:bg-email-white/80"
                    aria-label="Play audio review"
                  >
                    <AudioLines className="h-16 w-16" fill="email-charcoal" />
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

          <Card className="h-80 max-w-xl overflow-y-auto rounded-none bg-email-mint p-3">
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

        {impactRating !== null && audioUrl && (
          <div className="m-10 flex w-full flex-col items-center justify-center gap-1">
            <div className="flex flex-row items-center justify-center gap-4">
              <Card className="mb-8 max-w-xl rounded-none border-none">
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
                <p className="text-md m-1 text-right text-email-charcoal/80 md:max-w-md">
                  {impactDefinition}
                </p>
              )}
            </div>

            <Card className="w-full max-w-2xl rounded-none border-none p-4 text-email-charcoal md:p-2">
              <CardHeader className="p-2 text-center text-lg">
                <CardTitle className="text-2xl">If you sent as is...</CardTitle>
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
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row">
        <div className="m-4 flex w-full flex-col space-y-4 md:w-96">
          <Card className="h-[40rem] max-w-md rounded-none border-2 border-dashed border-email-charcoal bg-email-white text-email-charcoal">
            <CardContent>
              <Tabs defaultValue="review" className="mt-0 w-full">
                <TabsList className="grid w-full grid-cols-2 gap-0 p-3">
                  <TabsTrigger
                    value="review"
                    className="bg-email-white p-2 text-center text-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                  >
                    Review Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestions"
                    className="bg-email-white p-2 text-center text-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                  >
                    Reflections
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="mt-4">
                  <ScrollArea className="h-[calc(37rem-4rem)] px-4 pt-8 text-sm leading-relaxed">
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

                <TabsContent value="suggestions" className="mt-4">
                  <ScrollArea className="h-[calc(39rem-4rem)] p-3 px-4">
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
        <div className="w-full flex-1">
          <Card className="mb-8 max-w-xl border-none p-3">
            <CardHeader className="mb-4 w-52 border-2 border-email-charcoal p-2 text-center font-serif">
              <CardTitle className="text-xl">
                <span className="italic">Prompt</span> reminder:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-md pb-3 pl-3 pt-2 font-sans">
              {emailReviewData.promptText}
            </CardContent>
          </Card>

          <Card className="max-w-xl rounded-none bg-email-white">
            <div className="flex flex-row justify-end">
              <CardContent className="flex flex-row pb-3 pl-3 pr-4 pt-2 text-sm font-bold">
                <img
                  src="/assets/images/word-limit.svg"
                  alt="word limit icon"
                  className="h-8 w-8"
                />
                <p>{emailReviewData.wordLimit}</p>
              </CardContent>
            </div>
          </Card>

          <Textarea
            value={emailRewrite}
            onChange={handleEmailRewriteChange}
            className="mb-8 h-80 max-w-xl px-2 py-2 text-sm"
            placeholder="Rewrite your email here..."
          />

          <Card className="h-16 max-w-xl border-none">
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
