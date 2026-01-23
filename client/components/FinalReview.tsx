import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTtsAudio } from '../apis/tts'
import { useEffect, useRef, useState } from 'react'
import { FinalReview } from '@/models/final-review'
import { ArrowBigDownDash, AudioLines } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const queryClient = useQueryClient()

  //Retrieves email data from query cache. Keeps data fresh
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
    const reviewText = finalReviewData?.finalReview
    if (!reviewText) return //text doesn't exist
    if (audioUrl) return //audio is already generated
    if (ttsMutation.isPending) return //audio is being generated

    ttsMutation.mutate(reviewText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalReviewData?.finalReview, audioUrl, ttsMutation.isPending])

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

  const reviewParagraphs = finalReviewData?.finalReview.split(/\n\s*\n+/)

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
              <button
                onClick={handlePlayTts}
                disabled={ttsMutation.isPending}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal hover:bg-email-white/80 disabled:opacity-50"
                aria-label="Play audio review"
              >
                {ttsMutation.isPending && (
                  <span className="text-lg font-bold">...</span>
                )}

                {audioUrl && (
                  <AudioLines className="h-10 w-10" fill="email-charcoal" />
                )}

                {(!audioUrl || ttsMutation.isError) && (
                  <ArrowBigDownDash
                    className="h-10 w-10"
                    fill="email-charcoal"
                  />
                )}
              </button>
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

      <Card className="maxh-[30rem] my-4 rounded-none border-none bg-email-white text-email-charcoal md:w-[40rem]">
        <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
          <CardTitle className="mb-3 mt-2 w-40 border-2 border-email-charcoal p-2 text-center font-serif">
            Your Final Email
          </CardTitle>
        </CardHeader>
        <ScrollArea className="p-3 px-6 font-serif text-[15px] leading-relaxed">
          {reviewParagraphs?.map((para, index) => (
            <p key={index} className="mb-3">
              {para.trim()}
            </p>
          ))}
        </ScrollArea>
      </Card>

      <div className="flex">
        <Card className="mx-2 mt-4 w-full rounded-none border-none bg-email-white text-email-charcoal md:w-[40rem]">
          <CardContent>
            <Tabs defaultValue="prompt" className="mt-4 w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="prompt"
                  className="mx-1 rounded-none border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 text-center font-serif"
                >
                  Prompt
                </TabsTrigger>
                <TabsTrigger
                  value="final"
                  className="mx-1 rounded-none border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 px-2 text-center font-serif"
                >
                  Review Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="first"
                  className="mx-1 rounded-none border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 text-center font-serif"
                >
                  First Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="mt-8">
                <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border p-3 text-sm">
                  {finalReviewData?.promptText ??
                    'No prompt found for this email.'}
                </div>
              </TabsContent>

              <TabsContent value="final" className="mt-8">
                <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border p-3 text-sm">
                  {finalReviewData?.finalReview ?? 'No final review found.'}
                </div>
              </TabsContent>

              <TabsContent value="first" className="mt-8">
                <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border p-3 text-sm">
                  {finalReviewData?.emailRewrite ??
                    'First email & review not saved.'}
                </div>
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
