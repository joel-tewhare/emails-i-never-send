import { useEffect, useRef, useState } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import { Mic } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RecorderStatus = 'idle' | 'recording' | 'finalizing' | 'recorded' | 'error'

interface VoiceNoteProps {
  onAudioRecorded?: (audioBlob: Blob | null) => void
}

export default function VoiceNote({ onAudioRecorded }: VoiceNoteProps) {
  const [audio, setAudio] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [recorderStatus, setRecorderStatus] = useState<RecorderStatus>('idle')

  //time and recorder controls
  const MAX_SECONDS = 21
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (error) => {
      console.error('Error initializing recorder:', error)
      setRecorderStatus('error')
    },
  )

  // Ref to make stopRecording stable in timeout
  const recorderControlsRef = useRef(recorderControls)
  recorderControlsRef.current = recorderControls

  //clear audio, preview and start recording
  const startRecording = () => {
    setAudio(null)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return null
    })
    setRecorderStatus('recording')
    recorderControls.startRecording()
  }

  //clear audio, preview and set status as idle
  const reRecord = () => {
    setAudio(null)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return null
    })
    setRecorderStatus('idle')
    onAudioRecorded?.(null)
  }

  //time limit managed, recording stopped with ref once timeout reached
  useEffect(() => {
    if (recorderStatus !== 'recording') {
      return
    }

    const timeout = setTimeout(() => {
      setRecorderStatus('finalizing')
      recorderControlsRef.current.stopRecording()
    }, MAX_SECONDS * 1000)

    return () => clearTimeout(timeout)
  }, [recorderStatus])

  //add audio to state, set preview, update status to recorded
  const addAudioElement = (blob: Blob) => {
    setAudio(blob)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return URL.createObjectURL(blob)
    })
    setRecorderStatus('recorded')
    onAudioRecorded?.(blob)
  }

  const showRecorder =
    recorderStatus === 'recording' || recorderStatus === 'finalizing'

  return (
    <Card className="max-w-xl border-none p-4">
      <CardHeader className="mb-4 w-48 border-2 border-email-charcoal p-2 text-center font-serif">
        <CardTitle className="text-xl">Add a voice note</CardTitle>
      </CardHeader>
      <CardContent className="text-md pb-6 pl-3 pt-2 font-sans">
        <span className="font-bold italic">Optional</span>: Record a short voice
        note (up to 20 seconds) sharing how you hope the recipient will feel
        when they read your email. You&apos;ll receive an Impact Rating as part
        of your review and help with more personalized feedback.
      </CardContent>
      {/* Controls row - mic, visualizer, re-record button */}
      <div className="flex flex-row items-center justify-center gap-4 px-3 pb-3">
        {recorderStatus === 'idle' && (
          <button
            onClick={startRecording}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-email-charcoal text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
          >
            <Mic className="h-12 w-12" />
          </button>
        )}

        {showRecorder && (
          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            recorderControls={recorderControls}
            showVisualizer={true}
          />
        )}

        {recorderStatus === 'recorded' && (
          <button
            onClick={reRecord}
            className="rounded-xl bg-email-charcoal px-6 py-3 text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
          >
            Re-record
          </button>
        )}

        {recorderStatus === 'finalizing' && (
          <p className="px-3 pb-3">Finalizing...</p>
        )}

        {previewUrl && (
          <div className="px-3 pb-3">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio src={previewUrl} controls />
          </div>
        )}
      </div>
    </Card>
  )
}
