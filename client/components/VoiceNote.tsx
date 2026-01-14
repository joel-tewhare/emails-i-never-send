import { useEffect, useRef, useState } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'
import { Mic } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RecorderStatus = 'idle' | 'recording' | 'finalizing' | 'recorded' | 'error'

export default function VoiceNote() {
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
  }

  const showRecorder =
    recorderStatus === 'recording' || recorderStatus === 'finalizing'

  return (
    <Card className="my-8 max-w-xl bg-email-white p-4">
      <CardHeader className="pl-3 pt-2 font-serif">
        <CardTitle className="text-xl italic">Voice Note:</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 pl-3 pt-2 font-serif text-lg">
        Record a 20 second (max) audio clip about how you hope the recipient
        will feel receiving the email you have written. This will be sent as
        part of your review.
      </CardContent>
      {/* Controls row - mic, visualizer, re-record button */}
      <div className="flex flex-row items-center justify-center gap-4 px-3 pb-3">
        {recorderStatus === 'idle' && (
          <button
            onClick={startRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-email-charcoal text-email-white hover:bg-email-charcoal/80 hover:shadow-md"
          >
            <Mic className="h-6 w-6" />
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
