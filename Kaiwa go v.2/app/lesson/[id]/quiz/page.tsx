'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLearning } from '@/lib/learning-context'
import { getLessonById, type QuizQuestion } from '@/lib/lesson-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useSpeechSynthesis, useSpeechRecognition, calculateSimilarity, getFeedback } from '@/lib/speech'

interface QuizPageProps {
  params: Promise<{ id: string }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params)
  const { studentName, setQuizScore, setListeningScore, addSpeakingScore, completeLesson, getLessonProgress } = useLearning()
  const router = useRouter()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [listeningCorrect, setListeningCorrect] = useState(0)
  const [speakingScores, setSpeakingScores] = useState<number[]>([])

  const { speak, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis()
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported: sttSupported 
  } = useSpeechRecognition()

  const [speakingResult, setSpeakingResult] = useState<{ score: number; feedback: { message: string; type: string } } | null>(null)
  
  const lesson = getLessonById(resolvedParams.id)
  const lessonProgress = lesson ? getLessonProgress(lesson.id) : null

  useEffect(() => {
    if (!studentName) {
      router.push('/')
    }
  }, [studentName, router])

  if (!studentName || !lesson) {
    return null
  }

  const questions = lesson.quiz
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  const handleSelectAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return
    
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1)
      if (currentQuestion.type === 'listening') {
        setListeningCorrect(prev => prev + 1)
      }
    }
  }

  const handleListenQuestion = () => {
    if (currentQuestion.audioText) {
      speak(currentQuestion.audioText)
    } else if (currentQuestion.japanese) {
      speak(currentQuestion.japanese)
    }
  }

  const handleStartSpeaking = () => {
    setSpeakingResult(null)
    resetTranscript()
    startListening()
  }

  const handleStopSpeaking = () => {
    stopListening()
    setTimeout(() => {
      if (transcript && currentQuestion.japanese) {
        const score = calculateSimilarity(transcript, currentQuestion.japanese)
        const feedback = getFeedback(score)
        setSpeakingResult({ score, feedback })
        setSpeakingScores(prev => [...prev, score])
      }
    }, 300)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate final scores
      const quizScore = Math.round((correctAnswers / totalQuestions) * 100)
      const listeningScore = listeningCorrect > 0 ? Math.round((listeningCorrect / questions.filter(q => q.type === 'listening').length) * 100) : 0
      const avgSpeakingScore = speakingScores.length > 0 
        ? Math.round(speakingScores.reduce((a, b) => a + b, 0) / speakingScores.length)
        : 0
      
      setQuizScore(lesson.id, quizScore)
      setListeningScore(lesson.id, listeningScore)
      if (avgSpeakingScore > 0) {
        addSpeakingScore(lesson.id, avgSpeakingScore)
      }
      completeLesson(lesson.id)
      
      router.push(`/lesson/${lesson.id}/result`)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(false)
      setSpeakingResult(null)
      resetTranscript()
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link 
            href={`/lesson/${lesson.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Quiz</p>
            <p className="text-xs text-muted-foreground">{lesson.titleIndonesian}</p>
          </div>
        </header>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Soal {currentQuestionIndex + 1} dari {totalQuestions}</span>
            <span className="font-medium">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 space-y-6">
            {/* Question Type Badge */}
            <div className="flex justify-center">
              <span className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {currentQuestion.type === 'multiple-choice' && 'Pilihan Ganda'}
                {currentQuestion.type === 'matching' && 'Mencocokkan'}
                {currentQuestion.type === 'listening' && 'Mendengarkan'}
                {currentQuestion.type === 'speaking' && 'Berbicara'}
              </span>
            </div>

            {/* Question */}
            <div className="text-center space-y-3">
              <p className="text-lg font-medium text-foreground">
                {currentQuestion.question}
              </p>
              
              {currentQuestion.japanese && currentQuestion.type !== 'speaking' && (
                <p className="text-2xl text-foreground japanese-text">
                  {currentQuestion.japanese}
                </p>
              )}
              
              {currentQuestion.romaji && currentQuestion.type !== 'speaking' && (
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.romaji}
                </p>
              )}
            </div>

            {/* Listening Button */}
            {(currentQuestion.type === 'listening' || currentQuestion.audioText) && ttsSupported && (
              <Button
                variant="outline"
                onClick={handleListenQuestion}
                disabled={isSpeaking}
                className="w-full h-12"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                {isSpeaking ? 'Memutar...' : 'Putar Audio'}
              </Button>
            )}

            {/* Speaking Challenge */}
            {currentQuestion.type === 'speaking' && sttSupported && (
              <div className="space-y-4">
                {currentQuestion.japanese && (
                  <div className="bg-secondary/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Ucapkan:</p>
                    <p className="text-xl text-foreground japanese-text">{currentQuestion.japanese}</p>
                  </div>
                )}
                
                <Button
                  variant={isListening ? 'destructive' : 'secondary'}
                  onClick={isListening ? handleStopSpeaking : handleStartSpeaking}
                  className="w-full h-12"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? 'Selesai Berbicara' : 'Mulai Berbicara'}
                </Button>

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

                {speakingResult && (
                  <div className={`rounded-lg p-4 text-center ${
                    speakingResult.feedback.type === 'excellent' 
                      ? 'bg-primary/10' 
                      : speakingResult.feedback.type === 'good' 
                        ? 'bg-secondary' 
                        : 'bg-secondary/50'
                  }`}>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      Kemiripan: {speakingResult.score}%
                    </p>
                    <p className={`text-sm ${
                      speakingResult.feedback.type === 'excellent' 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                    }`}>
                      {speakingResult.feedback.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Multiple Choice / Matching Options */}
            {currentQuestion.options && currentQuestion.type !== 'speaking' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      showResult
                        ? index === currentQuestion.correctAnswer
                          ? 'border-foreground bg-primary/10 text-foreground'
                          : selectedAnswer === index
                            ? 'border-destructive bg-destructive/10 text-foreground'
                            : 'border-border text-muted-foreground'
                        : selectedAnswer === index
                          ? 'border-foreground bg-secondary text-foreground'
                          : 'border-border hover:border-foreground/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        showResult
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-primary text-primary-foreground'
                            : selectedAnswer === index
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-muted text-muted-foreground'
                          : selectedAnswer === index
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Result Feedback */}
            {showResult && currentQuestion.type !== 'speaking' && (
              <div className={`p-4 rounded-lg text-center ${
                isCorrect ? 'bg-primary/10' : 'bg-destructive/10'
              }`}>
                <p className={`font-medium ${isCorrect ? 'text-foreground' : 'text-foreground'}`}>
                  {isCorrect ? 'Benar!' : 'Kurang tepat'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        {currentQuestion.type !== 'speaking' ? (
          !showResult ? (
            <Button 
              onClick={handleCheckAnswer} 
              disabled={selectedAnswer === null}
              className="w-full h-12"
            >
              Periksa Jawaban
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full h-12">
              {isLastQuestion ? 'Lihat Hasil' : 'Soal Selanjutnya'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )
        ) : (
          speakingResult && (
            <Button onClick={handleNext} className="w-full h-12">
              {isLastQuestion ? 'Lihat Hasil' : 'Soal Selanjutnya'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )
        )}
      </div>
    </main>
  )
}
