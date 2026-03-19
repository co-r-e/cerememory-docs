import type { Metadata } from 'next'
import { Cormorant_Garamond, Figtree, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cerememory.dev'),
  title: 'Cerememory — A Living Memory Database for the Age of AI',
  description:
    'Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory. LLM-agnostic. User-sovereign. Brain-inspired.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${figtree.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-figtree), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
