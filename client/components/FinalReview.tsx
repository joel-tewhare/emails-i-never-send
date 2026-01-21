import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { generateTtsAudio } from '../apis/tts'
import { useEffect, useRef, useState } from 'react'
import { FinalReview } from '@/models/final-review'
import { ArrowBigDownDash, AudioLines } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const queryClient = useQueryClient()

  //Retrieves email data from query cache. Keeps data fresh
  const { data: finalReviewData } = useQuery<FinalReview>({
    queryKey: ['finalReview'],
    staleTime: Infinity,
  })

  //Checks cache data vs stored data and parses the stored data if needed ie. the page was refreshed. Data replaces the cached data.
  useEffect(() => {
    const cachedData = queryClient.getQueryData<FinalReview>(['finalReview'])
    if (cachedData) return

    const storedData = localStorage.getItem('finalReview')
    if (!storedData) return

    try {
      const parsedData = JSON.parse(storedData) as FinalReview
      queryClient.setQueryData(['finalReview'], parsedData)
    } catch (error) {
      console.error('Error parsing stored final review data:', error)
      localStorage.removeItem('finalReview')
    }
  }, [queryClient])

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

  return (
    <div>
      <div className="m-16 flex flex-row items-center justify-center">
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

      <div className="flex items-center justify-center">
        <Card className="mt-4 w-full md:w-[40rem] rounded-none border-none bg-email-white text-email-charcoal mx-2">
          <CardContent>
            <Tabs defaultValue="prompt" className="mt-4 w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="prompt" className="border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 text-center font-serif rounded-none mx-1">
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="final" className="border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 text-center font-serif rounded-none mx-1 px-2">Review Transcript</TabsTrigger>
                <TabsTrigger value="first" className="border-l-2 border-r-2 border-t-2 border-email-charcoal p-2 text-center font-serif rounded-none mx-1">First Email</TabsTrigger>
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

      <div className="flex flex-row gap-4 mt-8 items-center justify-center">
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
