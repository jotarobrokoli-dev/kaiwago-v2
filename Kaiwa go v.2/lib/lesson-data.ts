export interface LessonStep {
  id: number
  title: string
  japanese: string
  romaji: string
  indonesian: string
  type: 'learn' | 'listen' | 'quiz'
  practicePrompt?: string
}

export interface QuizQuestion {
  id: number
  type: 'multiple-choice' | 'matching' | 'listening' | 'speaking'
  question: string
  japanese?: string
  romaji?: string
  options?: string[]
  correctAnswer: string | number
  audioText?: string
}

export interface Lesson {
  id: string
  titleJapanese: string
  titleRomaji: string
  titleIndonesian: string
  description: string
  steps: LessonStep[]
  quiz: QuizQuestion[]
  isLocked: boolean
}

export const lessons: Lesson[] = [
  {
    id: 'jikoushokai',
    titleJapanese: '自己紹介',
    titleRomaji: 'Jikoushokai',
    titleIndonesian: 'Perkenalan Diri',
    description: 'Belajar memperkenalkan diri dalam bahasa Jepang',
    isLocked: false,
    steps: [
      {
        id: 1,
        title: 'Salam Pembuka',
        japanese: 'はじめまして。',
        romaji: 'Hajimemashite.',
        indonesian: 'Senang bertemu denganmu.',
        type: 'learn'
      },
      {
        id: 2,
        title: 'Nama',
        japanese: 'わたしは アキラ です。',
        romaji: 'Watashi wa Akira desu.',
        indonesian: 'Nama saya Akira.',
        type: 'learn',
        practicePrompt: 'Sebutkan namamu sendiri dengan pola: わたしは [nama] です'
      },
      {
        id: 3,
        title: 'Asal',
        japanese: 'インドネシアから きました。',
        romaji: 'Indonesia kara kimashita.',
        indonesian: 'Saya berasal dari Indonesia.',
        type: 'learn'
      },
      {
        id: 4,
        title: 'Status',
        japanese: 'わたしは こうこうせい です。',
        romaji: 'Watashi wa koukousei desu.',
        indonesian: 'Saya seorang siswa SMA.',
        type: 'learn'
      },
      {
        id: 5,
        title: 'Umur',
        japanese: 'じゅうろくさい です。',
        romaji: 'Juurokusai desu.',
        indonesian: 'Saya berusia 16 tahun.',
        type: 'learn'
      },
      {
        id: 6,
        title: 'Hobi',
        japanese: 'しゅみは おんがくを きくことです。',
        romaji: 'Shumi wa ongaku wo kikukoto desu.',
        indonesian: 'Hobi saya mendengarkan musik.',
        type: 'learn'
      },
      {
        id: 7,
        title: 'Makanan Favorit',
        japanese: 'すきなたべものは ラーメンです。',
        romaji: 'Suki na tabemono wa raamen desu.',
        indonesian: 'Makanan favorit saya ramen.',
        type: 'learn'
      },
      {
        id: 8,
        title: 'Cita-cita',
        japanese: 'しょうらい、せんせいに なりたいです。',
        romaji: 'Shourai, sensei ni naritai desu.',
        indonesian: 'Saya ingin menjadi guru di masa depan.',
        type: 'learn'
      },
      {
        id: 9,
        title: 'Latihan Mendengar',
        japanese: 'わたしは にほんごを べんきょうしています。',
        romaji: 'Watashi wa nihongo wo benkyou shiteimasu.',
        indonesian: 'Saya sedang belajar bahasa Jepang.',
        type: 'listen'
      },
      {
        id: 10,
        title: 'Penutup',
        japanese: 'どうぞ よろしく おねがいします。',
        romaji: 'Douzo yoroshiku onegaishimasu.',
        indonesian: 'Mohon bantuannya.',
        type: 'learn'
      }
    ],
    quiz: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Apa arti dari "はじめまして"?',
        japanese: 'はじめまして',
        romaji: 'Hajimemashite',
        options: [
          'Selamat tinggal',
          'Senang bertemu denganmu',
          'Terima kasih',
          'Permisi'
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Bagaimana cara mengatakan "Nama saya..." dalam bahasa Jepang?',
        options: [
          'わたしは... です',
          'これは... です',
          'あなたは... です',
          'かれは... です'
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        type: 'matching',
        question: 'Cocokkan: "インドネシアから きました" artinya...',
        japanese: 'インドネシアから きました',
        romaji: 'Indonesia kara kimashita',
        options: [
          'Saya tinggal di Indonesia',
          'Saya berasal dari Indonesia',
          'Saya pergi ke Indonesia',
          'Saya suka Indonesia'
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        type: 'listening',
        question: 'Dengarkan dan pilih arti yang benar:',
        audioText: 'しゅみは おんがくを きくことです',
        options: [
          'Hobi saya membaca buku',
          'Hobi saya mendengarkan musik',
          'Hobi saya bermain game',
          'Hobi saya menonton film'
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'Apa arti "こうこうせい"?',
        japanese: 'こうこうせい',
        romaji: 'Koukousei',
        options: [
          'Mahasiswa',
          'Siswa SMP',
          'Siswa SMA',
          'Guru'
        ],
        correctAnswer: 2
      },
      {
        id: 6,
        type: 'speaking',
        question: 'Ucapkan perkenalan diri lengkapmu dalam bahasa Jepang!',
        japanese: 'はじめまして。わたしは... です。',
        correctAnswer: 'hajimemashite watashi wa desu'
      }
    ]
  },
  {
    id: 'sekolah',
    titleJapanese: '学校',
    titleRomaji: 'Gakkou',
    titleIndonesian: 'Sekolah',
    description: 'Belajar kosakata tentang sekolah',
    isLocked: true,
    steps: [],
    quiz: []
  },
  {
    id: 'hobi',
    titleJapanese: '趣味',
    titleRomaji: 'Shumi',
    titleIndonesian: 'Hobi',
    description: 'Belajar membicarakan hobi',
    isLocked: true,
    steps: [],
    quiz: []
  },
  {
    id: 'restoran',
    titleJapanese: 'レストラン',
    titleRomaji: 'Resutoran',
    titleIndonesian: 'Restoran',
    description: 'Belajar memesan makanan di restoran',
    isLocked: true,
    steps: [],
    quiz: []
  },
  {
    id: 'belanja',
    titleJapanese: '買い物',
    titleRomaji: 'Kaimono',
    titleIndonesian: 'Belanja',
    description: 'Belajar berbelanja dalam bahasa Jepang',
    isLocked: true,
    steps: [],
    quiz: []
  }
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id)
}
