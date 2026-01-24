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
import { AudioLines } from 'lucide-react'

export default function Review() {
  const [emailRewrite, setEmailRewrite] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

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
    const sentenceSuggestions = review.spokenSuggestionSummary?.trim()
    const nextStep = review.nextStep?.trim()

    const parts: string[] = []

    if (paragraphs.length > 0) {
      parts.push(paragraphs.join('\n\n'))
    }

    if (sentenceSuggestions) {
      parts.push(sentenceSuggestions)
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
    audioUrl,
    ttsMutation.isPending,
  ])

  const rewriteReviewMutation = useMutation({
    mutationFn: ({
      promptText,
      originalEmailContent,
      finalEmailContent,
      originalImpactRatingPercent,
    }: {
      promptText: string
      originalEmailContent: string
      finalEmailContent: string
      originalImpactRatingPercent: number | null
    }) =>
      getFinalReview(
        originalEmailContent,
        promptText,
        finalEmailContent,
        originalImpactRatingPercent,
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
    }
  }, [audioUrl])

  const handlePlayTts = () => {
    if (!audioRef.current) return
    // If audio already generated, just play it
    audioRef.current.play()
  }

  const handleRewriteReview = () => {
    if (!emailReviewData || emailRewrite.trim() === '') return

    rewriteReviewMutation.mutate({
      finalEmailContent: emailRewrite,
      promptText: emailReviewData.promptText,
      originalEmailContent: emailReviewData.emailOriginal,
      originalImpactRatingPercent: impactRating,
    })
  }

  if (!emailReviewData) {
    return <div>Missing review data</div>
  }

  // Extract review data with proper type safety
  const reviewData = emailReviewData.reviewData
  if (!reviewData) {
    return <div>Missing review data</div>
  }

  const reviewParagraphs = reviewData.coachReviewParagraphs ?? []
  const sentenceSuggestions = reviewData.sentenceSuggestions ?? []
  const impactRating = reviewData.impactRatingPercent
  const impactExplanation = reviewData.impactRatingExplanation

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
        <div>
          <p className="max-w-2xl pb-12 text-left text-2xl font-bold">
            1. Your audio review will be loaded shortly.
          </p>
          <p className="max-w-2xl pb-12 text-left text-2xl font-bold">
            2. Use the feedback and suggestions to rewrite your email.
          </p>
          <p className="max-w-2xl pb-12 text-left text-2xl font-bold">
            3. Send for your final review
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-center">
          <Card className="m-8 h-80 max-w-md rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle className="mb-10 text-center">
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
                  <span className="text-3xl text-email-charcoal">
                    <span className="italic">Listen</span> to your review:
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
                    Audio unavailable at this time (free tier limits)
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
                  />
                )}
              </div>
            </CardHeader>
          </Card>

          <Card className="h-80 max-w-xl overflow-y-auto rounded-none bg-email-mint p-3">
            <ScrollArea className="text-md h-64 p-3 italic">
              {originalParagraphs.map((para, index) => (
                <p key={index} className="mb-3">
                  {para.trim()}
                </p>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {impactRating !== null && audioUrl && (
          <div className="m-8 flex flex-row items-center justify-center gap-4">
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
            {impactExplanation && (
              <p className="text-md m-1 text-right text-email-charcoal/80 md:max-w-md">
                {impactExplanation}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row">
        <div className="m-4 flex w-full flex-col space-y-4 md:w-96">
          <Card className="h-[40rem] max-w-md rounded-none border-2 border-dashed border-email-charcoal bg-email-white text-email-charcoal">
            <CardContent>
              <Tabs defaultValue="review" className="mt-4 w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="review"
                    className="w-36 rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                  >
                    Review Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestions"
                    className="w-42 rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-charcoal data-[state=active]:font-bold data-[state=active]:text-email-white"
                  >
                    Sentence Suggestions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="mt-4">
                  <ScrollArea className="h-[calc(37rem-4rem)] p-3 px-4 text-sm leading-relaxed">
                    {reviewParagraphs.map((para, index) => (
                      <p key={index} className="mb-3">
                        {para.trim()}
                      </p>
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="suggestions" className="mt-4">
                  <ScrollArea className="h-[calc(37rem-4rem)] p-3 px-4">
                    {sentenceSuggestions.length > 0 ? (
                      <div className="space-y-4 text-sm leading-relaxed">
                        {sentenceSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="border-l-2 border-email-charcoal/20 pl-2"
                          >
                            <p className="mb-1 font-semibold italic">
                              You wrote:
                            </p>
                            <p className="mb-2 mb-6 italic text-email-charcoal/70">
                              {suggestion.original}
                            </p>
                            <p className="mb-1 font-semibold underline">
                              Suggestion:
                            </p>
                            <p className="mb-2">{suggestion.suggestion}</p>
                            <p className="mb-8 text-xs italic text-email-charcoal/60">
                              {suggestion.why}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-email-charcoal/60">
                        No sentence suggestions available.
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
            className="h-80 max-w-xl px-2 py-2 text-sm"
            placeholder="Rewrite your email here..."
          />

          <Card className="h-16 max-w-xl border-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button
                  onClick={handleRewriteReview}
                  className="rounded-xl bg-email-mint px-4 py-3 text-email-charcoal hover:shadow-md"
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
