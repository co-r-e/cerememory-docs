'use client'

import { useEffect } from 'react'

export default function JaLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'ja'
    return () => {
      document.documentElement.lang = 'en'
    }
  }, [])

  return children
}
