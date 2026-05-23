'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLearning } from '@/lib/learning-context'
import { lessons } from '@/lib/lesson-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { studentName, getOverallProgress, getLessonProgress } = useLearning()
  const router = useRouter()

  useEffect(() => {
    if (!studentName) {
      router.push('/')
    }
  }, [studentName, router])

  if (!studentName) {
    return null
  }

  const jikoushokaiProgress = getOverallProgress('jikoushokai')
  const jikoushokaiLessonProgress = getLessonProgress('jikoushokai')

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Kembali
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-foreground japanese-text">
                こんにちは, {studentName}!
              </p>
              <p className="text-muted-foreground mt-1">
                Selamat datang di KaiwaGo
              </p>
            </div>
          </div>
        </header>

        {/* Overall Progress Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Progress Belajarmu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Kemajuan</span>
              <span className="font-medium">{jikoushokaiProgress}%</span>
            </div>
            <Progress value={jikoushokaiProgress} className="h-2" />
            {jikoushokaiLessonProgress.isCompleted && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>1 Pelajaran Selesai</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lessons Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tema Pembelajaran</h2>
          
          <div className="space-y-3">
            {lessons.map((lesson) => {
              const progress = getOverallProgress(lesson.id)
              const lessonProgress = getLessonProgress(lesson.id)
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`border transition-all ${
                    lesson.isLocked 
                      ? 'border-border/50 opacity-60' 
                      : 'border-border hover:border-foreground/20 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <CardContent className="p-4">
                    {lesson.isLocked ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground japanese-text">
                              {lesson.titleJapanese}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.titleIndonesian}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          Segera Hadir
                        </span>
                      </div>
                    ) : (
                      <Link href={`/lesson/${lesson.id}`} className="block">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                              <span className="text-primary-foreground font-bold text-lg">
                                {lesson.titleJapanese.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground japanese-text">
                                {lesson.titleJapanese}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {lesson.titleIndonesian}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {lessonProgress.isCompleted ? (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                Selesai
                              </span>
                            ) : progress > 0 ? (
                              <span className="text-sm font-medium text-foreground">
                                {progress}%
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Mulai
                              </span>
                            )}
                          </div>
                        </div>
                        {progress > 0 && !lessonProgress.isCompleted && (
                          <div className="mt-3">
                            <Progress value={progress} className="h-1" />
                          </div>
                        )}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Quick Actions */}
        {jikoushokaiProgress > 0 && !jikoushokaiLessonProgress.isCompleted && (
          <Card className="border border-border bg-secondary/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">Lanjutkan Belajar</p>
                  <p className="text-sm text-muted-foreground">
                    自己紹介 - Perkenalan Diri
                  </p>
                </div>
                <Button asChild>
                  <Link href="/lesson/jikoushokai">
                    Lanjutkan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
