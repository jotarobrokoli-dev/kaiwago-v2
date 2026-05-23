'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useSpeechRecognition, useSpeechSynthesis, calculateSimilarity, getFeedback } from '@/lib/speech'
import type { LessonStep } from '@/lib/lesson-data'

interface LessonCardProps {
  step: LessonStep
  currentStep: number
  totalSteps: number
  onNext: () => void
  onComplete: (speakingScore?: number) => void
  isLastStep: boolean
}

export function LessonCard({ step, currentStep, totalSteps, onNext, onComplete, isLastStep }: LessonCardProps) {
  const [showSpeaking, setShowSpeaking] = useState(false)
  const [speakingScore, setSpeakingScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ message: string; type: string } | null>(null)
  
  const { speak, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported: sttSupported 
  } = useSpeechRecognition()

  const handleListen = () => {
    speak(step.japanese)
  }

  const handleStartSpeaking = () => {
    setShowSpeaking(true)
    setSpeakingScore(null)
    setFeedback(null)
    resetTranscript()
    startListening()
  }

  const handleStopSpeaking = () => {
    stopListening()
    // Calculate score after a brief delay to ensure transcript is updated
    setTimeout(() => {
      if (transcript) {
        const score = calculateSimilarity(transcript, step.japanese)
        setSpeakingScore(score)
        setFeedback(getFeedback(score))
      }
    }, 300)
  }

  const handleNext = () => {
    if (isLastStep) {
      onComplete(speakingScore ?? undefined)
    } else {
      onNext()
      // Reset state for next card
      setShowSpeaking(false)
      setSpeakingScore(null)
      setFeedback(null)
      resetTranscript()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Langkah {currentStep} dari {totalSteps}</span>
          <span className="font-medium">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* Main Card */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Step Title */}
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {step.title}
            </span>
          </div>

          {/* Japanese Text */}
          <div className="text-center space-y-4">
            <p className="text-3xl md:text-4xl font-medium text-foreground japanese-text leading-relaxed">
              {step.japanese}
            </p>
            
            {/* Romaji */}
            <p className="text-lg text-muted-foreground">
              {step.romaji}
            </p>
            
            {/* Indonesian Translation */}
            <div className="pt-2 border-t border-border">
              <p className="text-base text-foreground">
                {step.indonesian}
              </p>
            </div>
          </div>

          {/* Practice Prompt */}
          {step.practicePrompt && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                {step.practicePrompt}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Audio Button */}
            {ttsSupported && (
              <Button
                variant="outline"
                onClick={handleListen}
                disabled={isSpeaking}
                className="w-full h-12"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                {isSpeaking ? 'Memutar...' : 'Dengarkan Audio'}
              </Button>
            )}

            {/* Speaking Practice Button */}
            {sttSupported && (
              <Button
                variant={isListening ? 'destructive' : 'secondary'}
                onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                className="w-full h-12"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isListening ? 'Selesai Berbicara' : 'Latihan Speaking'}
              </Button>
            )}
          </div>

          {/* Speaking Results */}
          {showSpeaking && (
            <div className="space-y-4 pt-4 border-t border-border">
              {isListening && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse delay-100"></span>
                    <span className="w-2 h-2 bg-destructive rounded-full animate-pulse delay-200"></span>
                  </div>
                  <p className="text-sm text-muted-foreground">Mendengarkan...</p>
                </div>
              )}

              {transcript && (
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Kamu berkata:</p>
                  <p className="text-lg text-foreground japanese-text">{transcript}</p>
                </div>
              )}

              {speakingScore !== null && feedback && (
                <div className={`rounded-lg p-4 text-center ${
                  feedback.type === 'excellent' 
                    ? 'bg-primary/10' 
                    : feedback.type === 'good' 
                      ? 'bg-secondary' 
                      : 'bg-secondary/50'
                }`}>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    Kemiripan: {speakingScore}%
                  </p>
                  <p className={`text-sm ${
                    feedback.type === 'excellent' 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    {feedback.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Button onClick={handleNext} className="w-full h-12">
        {isLastStep ? 'Mulai Quiz' : 'Lanjut'}
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  )
}
