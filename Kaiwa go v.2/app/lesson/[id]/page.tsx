'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLearning } from '@/lib/learning-context'
import { getLessonById } from '@/lib/lesson-data'
import { LessonCard } from '@/components/lesson-card'
import { Button } from '@/components/ui/button'

interface LessonPageProps {
  params: Promise<{ id: string }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = use(params)
  const { studentName, getLessonProgress, completeLessonStep, addSpeakingScore, setCurrentLessonId } = useLearning()
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  const lesson = getLessonById(resolvedParams.id)
  const lessonProgress = lesson ? getLessonProgress(lesson.id) : null

  useEffect(() => {
    if (!studentName) {
      router.push('/')
      return
    }
    
    if (lesson) {
      setCurrentLessonId(lesson.id)
      // Resume from last step if available
      if (lessonProgress && lessonProgress.currentStep > 0) {
        setCurrentStepIndex(Math.min(lessonProgress.currentStep, lesson.steps.length - 1))
      }
    }
  }, [studentName, router, lesson, lessonProgress, setCurrentLessonId])

  if (!studentName || !lesson) {
    return null
  }

  if (lesson.isLocked) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Pelajaran Terkunci</h1>
          <p className="text-muted-foreground">Pelajaran ini akan segera tersedia.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </main>
    )
  }

  const currentStep = lesson.steps[currentStepIndex]
  const totalSteps = lesson.steps.length

  const handleNext = () => {
    if (currentStep) {
      completeLessonStep(lesson.id, currentStep.id)
    }
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleComplete = (speakingScore?: number) => {
    if (currentStep) {
      completeLessonStep(lesson.id, currentStep.id)
    }
    if (speakingScore !== undefined) {
      addSpeakingScore(lesson.id, speakingScore)
    }
    // Navigate to quiz
    router.push(`/lesson/${lesson.id}/quiz`)
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground japanese-text">{lesson.titleJapanese}</p>
            <p className="text-xs text-muted-foreground">{lesson.titleIndonesian}</p>
          </div>
        </header>

        {/* Lesson Content */}
        {currentStep && (
          <LessonCard
            step={currentStep}
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            onNext={handleNext}
            onComplete={handleComplete}
            isLastStep={currentStepIndex === totalSteps - 1}
          />
        )}
      </div>
    </main>
  )
}
