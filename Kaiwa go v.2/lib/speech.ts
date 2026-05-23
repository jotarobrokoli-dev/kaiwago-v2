'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isSupported: boolean
  error: string | null
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'ja-JP'
        
        recognition.onresult = (event) => {
          let finalTranscript = ''
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }
          
          setTranscript(finalTranscript || interimTranscript)
        }
        
        recognition.onerror = (event) => {
          setError(event.error)
          setIsListening(false)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError(null)
      setTranscript('')
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch {
        setError('Could not start speech recognition')
      }
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error
  }
}

// Text-to-speech hook for listening practice
interface UseSpeechSynthesisReturn {
  speak: (text: string) => void
  isSpeaking: boolean
  isSupported: boolean
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('speechSynthesis' in window)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.8 // Slower for learners
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  return {
    speak,
    isSpeaking,
    isSupported
  }
}

// Calculate similarity between two strings (for pronunciation scoring)
export function calculateSimilarity(str1: string, str2: string): number {
  // Convert to lowercase and remove punctuation for comparison
  const clean1 = str1.toLowerCase().replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '').trim()
  const clean2 = str2.toLowerCase().replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '').trim()
  
  if (clean1 === clean2) return 100
  if (clean1.length === 0 || clean2.length === 0) return 0
  
  // Levenshtein distance
  const matrix: number[][] = []
  
  for (let i = 0; i <= clean1.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= clean2.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= clean1.length; i++) {
    for (let j = 1; j <= clean2.length; j++) {
      const cost = clean1[i - 1] === clean2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  
  const distance = matrix[clean1.length][clean2.length]
  const maxLength = Math.max(clean1.length, clean2.length)
  const similarity = ((maxLength - distance) / maxLength) * 100
  
  // Be more lenient - boost scores for partial matches
  return Math.min(100, Math.round(similarity * 1.2))
}

export function getFeedback(score: number): { message: string; type: 'excellent' | 'good' | 'tryAgain' } {
  if (score >= 85) {
    return { message: 'Sempurna! Pengucapanmu sangat bagus!', type: 'excellent' }
  } else if (score >= 60) {
    return { message: 'Bagus! Terus berlatih!', type: 'good' }
  } else {
    return { message: 'Coba lagi, kamu pasti bisa!', type: 'tryAgain' }
  }
}

// Global type declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}
