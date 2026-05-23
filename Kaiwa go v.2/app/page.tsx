'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLearning } from '@/lib/learning-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setStudentName, studentName } = useLearning()
  const router = useRouter()

  const handleStart = () => {
    if (name.trim()) {
      setIsLoading(true)
      setStudentName(name.trim())
      router.push('/dashboard')
    }
  }

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            KaiwaGo
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Belajar Berbicara Bahasa Jepang
          </p>
        </div>

        {/* Description Card */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              Media pembelajaran kaiwa bahasa Jepang untuk siswa SMA/SMK pemula. 
              Mulai perjalananmu mempelajari bahasa Jepang dari perkenalan diri.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-secondary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Pelajaran Interaktif</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-secondary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Latihan Speaking</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-secondary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Quiz JLPT N5</p>
          </div>
        </div>

        {/* Name Input Form */}
        <div className="space-y-4">
          {studentName ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Selamat datang kembali,</p>
                <p className="text-xl font-semibold text-foreground">{studentName}</p>
              </div>
              <Button 
                onClick={handleContinue}
                className="w-full h-12 text-base font-medium"
              >
                Lanjutkan Belajar
              </Button>
              <button 
                onClick={() => {
                  localStorage.removeItem('kaiwago-learning-state')
                  window.location.reload()
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ganti Pengguna
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Masukkan Namamu
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Contoh: Budi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="h-12 text-base"
                  autoComplete="name"
                />
              </div>
              <Button 
                onClick={handleStart}
                disabled={!name.trim() || isLoading}
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? 'Memulai...' : 'Mulai Belajar'}
              </Button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Level: JLPT N5 Pemula
        </p>
      </div>
    </main>
  )
}
