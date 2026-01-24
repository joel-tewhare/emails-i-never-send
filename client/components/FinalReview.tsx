import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTtsAudio } from '../apis/tts'
import { useEffect, useRef, useState } from 'react'
import { FinalReview } from '@/models/final-review'
import { AudioLines } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

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
      //avoid duplicate audio URLs
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
    finalReviewData?.reviewData?.coachReviewParagraphs,
    finalReviewData?.reviewData?.nextStep,
    audioUrl,
    ttsMutation.isPending,
  ])

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

  const reviewParagraphs =
    finalReviewData?.reviewData?.coachReviewParagraphs ?? []
  const sentenceSuggestions =
    finalReviewData?.reviewData?.sentenceSuggestions ?? []
  const impactRating = finalReviewData?.reviewData?.impactRatingPercent
  const impactExplanation = finalReviewData?.reviewData?.impactRatingExplanation

  const finalEmailParagraphs =
    finalReviewData?.finalEmail?.split(/\n\s*\n+/) ?? []
  const originalParagraphs =
    finalReviewData?.emailOriginal.split(/\n\s*\n+/) ?? []

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <div className="flex flex-row">
        <img
          src="/assets/images/icon-tabs-group-graphic.svg"
          alt="tabs group graphic"
          className="h-96"
        />

        <Card className="mx-4 h-96 w-96 rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
          <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
            <CardTitle className="mb-4 text-center">
              {!audioUrl && ttsMutation.isPending && (
                <span className="text-sm text-email-charcoal/80">
                  Loading review audio…
                </span>
              )}

              {!audioUrl && ttsMutation.isError && (
                <span>
                  Couldn&apos;t generate audio. See review notes below
                </span>
              )}

              {audioUrl && <span>Listen to your review:</span>}
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
                  <AudioLines className="h-10 w-10" fill="email-charcoal" />
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

      <Card className="maxh-[30rem] my-4 rounded-none border-none bg-email-white text-email-charcoal md:w-[40rem]">
        <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
          <CardTitle className="mb-3 mt-2 w-40 border-2 border-email-charcoal p-2 text-center font-serif">
            Your Final Email
          </CardTitle>
        </CardHeader>
        <ScrollArea className="p-3 px-6 font-serif text-[15px] leading-relaxed">
          {finalEmailParagraphs?.map((para, index) => (
            <p key={index} className="mb-3">
              {para.trim()}
            </p>
          ))}
        </ScrollArea>
      </Card>

      <div className="flex">
        <Card className="mx-2 mt-4 h-[40rem] w-full rounded-none border-2 border-dashed border-email-charcoal bg-email-white text-email-charcoal md:w-[40rem]">
          <CardContent>
            <Tabs defaultValue="prompt" className="mt-4 w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="prompt"
                  className="rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  Prompt
                </TabsTrigger>
                <TabsTrigger
                  value="final"
                  className="rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  Review Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="suggestions"
                  className="rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-charcoal data-[state=active]:font-bold data-[state=active]:text-email-white"
                >
                  Sentence Suggestions
                </TabsTrigger>
                <TabsTrigger
                  value="first"
                  className="rounded-md border-2 border-email-mint bg-email-white p-2 text-center font-serif text-email-charcoal data-[state=active]:border-email-charcoal data-[state=active]:bg-email-mint data-[state=active]:font-bold"
                >
                  First Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="mt-4">
                <ScrollArea className="h-[calc(37rem-4rem)] p-3 px-4 text-sm leading-relaxed">
                  {finalReviewData?.promptText ??
                    'No prompt found for this email.'}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="final" className="mt-4">
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

              <TabsContent value="first" className="mt-4">
                <ScrollArea className="h-[calc(37rem-4rem)] p-3 px-4 text-sm leading-relaxed">
                  {originalParagraphs.map((para, index) => (
                    <p key={index} className="mb-3">
                      {para.trim()}
                    </p>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-row gap-4">
        <Button className="rounded-xl bg-email-charcoal px-4 text-email-white hover:bg-email-charcoal/80 hover:shadow-md">
          Save Email
        </Button>

        <Button className="rounded-xl bg-email-charcoal px-4 text-email-white hover:bg-email-charcoal/80 hover:shadow-md">
          Start New Email
        </Button>
      </div>
    </div>
  )
}
