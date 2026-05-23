'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface LessonProgress {
  lessonId: string
  currentStep: number
  completedSteps: number[]
  speakingScores: number[]
  listeningScore: number
  quizScore: number
  isCompleted: boolean
}

interface LearningState {
  studentName: string
  currentLessonId: string | null
  progress: Record<string, LessonProgress>
}

interface LearningContextType {
  studentName: string
  setStudentName: (name: string) => void
  currentLessonId: string | null
  setCurrentLessonId: (id: string | null) => void
  getLessonProgress: (lessonId: string) => LessonProgress
  updateLessonProgress: (lessonId: string, updates: Partial<LessonProgress>) => void
  completeLessonStep: (lessonId: string, stepId: number) => void
  addSpeakingScore: (lessonId: string, score: number) => void
  setListeningScore: (lessonId: string, score: number) => void
  setQuizScore: (lessonId: string, score: number) => void
  completeLesson: (lessonId: string) => void
  getOverallProgress: (lessonId: string) => number
  resetProgress: () => void
}

const defaultProgress: LessonProgress = {
  lessonId: '',
  currentStep: 0,
  completedSteps: [],
  speakingScores: [],
  listeningScore: 0,
  quizScore: 0,
  isCompleted: false
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>({
    studentName: '',
    currentLessonId: null,
    progress: {}
  })

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kaiwago-learning-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(parsed)
      } catch {
        // Invalid data, use defaults
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (state.studentName) {
      localStorage.setItem('kaiwago-learning-state', JSON.stringify(state))
    }
  }, [state])

  const setStudentName = (name: string) => {
    setState(prev => ({ ...prev, studentName: name }))
  }

  const setCurrentLessonId = (id: string | null) => {
    setState(prev => ({ ...prev, currentLessonId: id }))
  }

  const getLessonProgress = (lessonId: string): LessonProgress => {
    return state.progress[lessonId] || { ...defaultProgress, lessonId }
  }

  const updateLessonProgress = (lessonId: string, updates: Partial<LessonProgress>) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [lessonId]: {
          ...getLessonProgress(lessonId),
          ...updates
        }
      }
    }))
  }

  const completeLessonStep = (lessonId: string, stepId: number) => {
    const progress = getLessonProgress(lessonId)
    if (!progress.completedSteps.includes(stepId)) {
      updateLessonProgress(lessonId, {
        completedSteps: [...progress.completedSteps, stepId],
        currentStep: Math.max(progress.currentStep, stepId)
      })
    }
  }

  const addSpeakingScore = (lessonId: string, score: number) => {
    const progress = getLessonProgress(lessonId)
    updateLessonProgress(lessonId, {
      speakingScores: [...progress.speakingScores, score]
    })
  }

  const setListeningScore = (lessonId: string, score: number) => {
    updateLessonProgress(lessonId, { listeningScore: score })
  }

  const setQuizScore = (lessonId: string, score: number) => {
    updateLessonProgress(lessonId, { quizScore: score })
  }

  const completeLesson = (lessonId: string) => {
    updateLessonProgress(lessonId, { isCompleted: true })
  }

  const getOverallProgress = (lessonId: string): number => {
    const progress = getLessonProgress(lessonId)
    // Total steps is 10 for jikoushokai + quiz
    const totalSteps = 10
    const completedSteps = progress.completedSteps.length
    return Math.round((completedSteps / totalSteps) * 100)
  }

  const resetProgress = () => {
    setState({
      studentName: '',
      currentLessonId: null,
      progress: {}
    })
    localStorage.removeItem('kaiwago-learning-state')
  }

  return (
    <LearningContext.Provider value={{
      studentName: state.studentName,
      setStudentName,
      currentLessonId: state.currentLessonId,
      setCurrentLessonId,
      getLessonProgress,
      updateLessonProgress,
      completeLessonStep,
      addSpeakingScore,
      setListeningScore,
      setQuizScore,
      completeLesson,
      getOverallProgress,
      resetProgress
    }}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}
