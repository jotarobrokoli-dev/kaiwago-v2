'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLearning } from '@/lib/learning-context'
import { getLessonById } from '@/lib/lesson-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ResultPageProps {
  params: Promise<{ id: string }>
}

export default function ResultPage({ params }: ResultPageProps) {
  const resolvedParams = use(params)
  const { studentName, getLessonProgress } = useLearning()
  const router = useRouter()
  
  const lesson = getLessonById(resolvedParams.id)
  const lessonProgress = lesson ? getLessonProgress(lesson.id) : null

  useEffect(() => {
    if (!studentName) {
      router.push('/')
    }
  }, [studentName, router])

  if (!studentName || !lesson || !lessonProgress) {
    return null
  }

  const speakingAvg = lessonProgress.speakingScores.length > 0
    ? Math.round(lessonProgress.speakingScores.reduce((a, b) => a + b, 0) / lessonProgress.speakingScores.length)
    : 0

  const finalScore = Math.round(
    (lessonProgress.quizScore * 0.4) + 
    (lessonProgress.listeningScore * 0.3) + 
    (speakingAvg * 0.3)
  )

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', message: 'Luar biasa! Kamu sangat hebat!' }
    if (score >= 80) return { grade: 'B', message: 'Bagus sekali! Terus berlatih!' }
    if (score >= 70) return { grade: 'C', message: 'Cukup baik! Masih bisa ditingkatkan!' }
    if (score >= 60) return { grade: 'D', message: 'Perlu latihan lebih banyak!' }
    return { grade: 'E', message: 'Jangan menyerah! Coba lagi!' }
  }

  const { grade, message } = getGrade(finalScore)

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Hasil Pembelajaran</p>
          <h1 className="text-2xl font-bold text-foreground japanese-text">
            {lesson.titleJapanese} Completed
          </h1>
        </header>

        {/* Completion Badge */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-foreground">{grade}</p>
              <p className="text-xs text-primary-foreground/80">Grade</p>
            </div>
          </div>
        </div>

        {/* Final Score */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-5xl font-bold text-foreground">{finalScore}</p>
            <p className="text-muted-foreground mt-2">Skor Akhir dari 100</p>
            <p className="text-sm text-foreground mt-4">{message}</p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Rincian Skor</h2>
          
          <div className="grid gap-3">
            {/* Speaking Score */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Speaking</p>
                      <p className="text-xs text-muted-foreground">Latihan berbicara</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{speakingAvg}</p>
                </div>
              </CardContent>
            </Card>

            {/* Listening Score */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Listening</p>
                      <p className="text-xs text-muted-foreground">Pemahaman mendengar</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{lessonProgress.listeningScore}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Score */}
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Quiz</p>
                      <p className="text-xs text-muted-foreground">Pemahaman materi</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground">{lessonProgress.quizScore}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievement Badge */}
        <Card className="border border-primary bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-foreground japanese-text">
              {lesson.titleJapanese} Completed
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat! Kamu telah menyelesaikan pelajaran {lesson.titleIndonesian}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full h-12">
            <Link href="/dashboard">
              Kembali ke Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12">
            <Link href={`/lesson/${lesson.id}`}>
              Ulangi Pelajaran
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
