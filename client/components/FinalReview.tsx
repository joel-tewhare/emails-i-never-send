import { useMutation, useQuery } from "@tanstack/react-query"
import { generateTtsAudio } from "../apis/tts"
import { useEffect, useRef, useState } from "react"
import { FinalReview } from "@/models/final-review"
import { ArrowBigDownDash, AudioLines } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const {data: finalReviewData} = useQuery<FinalReview>({
    queryKey: ['finalReview'],
    enabled: false,
  })

  //second use of mutation - can this be refactored to helper function?
  const ttsMutation = useMutation({
    mutationFn: (text: string) => generateTtsAudio(text),
    onSuccess: (audioBlob) => {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      // Auto-play when audio is ready
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
      }
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
    if (!finalReviewData?.finalReview) return

    if (audioUrl && audioRef.current) {
      // If audio already generated, just play it
      audioRef.current.play()
    } else {
      // Generate new audio
      ttsMutation.mutate(finalReviewData.finalReview)
    }
  }

  const isReviewPending = ttsMutation.isPending
  
  return (
    <div className="relative min-h-screen w-full bg-email-grey p-4">
    {isReviewPending && (
      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-email-grey/60">
      <p className="text-email-charcoal">Getting your final review...</p>
      </div>)}

    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row">
      <div className="m-4 flex w-full flex-col space-y-4 md:w-96">
        <Card className="h-64 max-w-md rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
          <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
            <CardTitle className="mb-4 text-center">
            {!audioUrl && ttsMutation.isPending && (
                <span className="text-sm text-email-charcoal/80">Loading review audio…</span>
              )}

              {!audioUrl && ttsMutation.isError && (
                <span>Couldn&apos;t generate audio. See review notes below</span>)}

              {audioUrl && (
              <span>Your final review:</span>
              )}
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
                  <AudioLines
                    className="h-10 w-10"
                    fill="email-charcoal"
                  />
                )}

                {!audioUrl || ttsMutation.isError && (
                  <ArrowBigDownDash className="h-10 w-10" fill="email-charcoal" />
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
    </div>
  </div>)
}