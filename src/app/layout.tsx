import type { Metadata, Viewport } from 'next'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://co-r-e.github.io'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const TITLE = 'Cerememory - A Living Memory Database for the Age of AI'
const DESCRIPTION =
  'Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory across sessions. LLM-agnostic (Claude, GPT, Gemini), user-sovereign, brain-inspired, and built in Rust. Speaks CMP over HTTP, gRPC, and MCP.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Cerememory',
  },
  description: DESCRIPTION,
  applicationName: 'Cerememory',
  generator: 'Next.js',
  keywords: [
    'Cerememory',
    'AI memory',
    'LLM memory',
    'memory database',
    'persistent memory for LLMs',
    'neuroscience-inspired database',
    'CMP protocol',
    'Cerememory Protocol',
    'MCP',
    'Model Context Protocol',
    'Claude memory',
    'GPT memory',
    'Gemini memory',
    'vector search',
    'spreading activation',
    'memory decay',
    'episodic memory',
    'semantic memory',
    'Rust',
    'open source',
    'local-first',
    'user-sovereign',
  ],
  authors: [{ name: 'Cerememory' }],
  creator: 'Cerememory',
  publisher: 'Cerememory',
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: `${BASE_PATH}/`,
    languages: {
      en: `${BASE_PATH}/`,
      ja: `${BASE_PATH}/ja`,
      'x-default': `${BASE_PATH}/`,
    },
  },
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, sizes: '48x48', type: 'image/x-icon' },
      { url: `${BASE_PATH}/icon.svg`, type: 'image/svg+xml' },
      { url: `${BASE_PATH}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${BASE_PATH}/icon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [`${BASE_PATH}/favicon.ico`],
    apple: [
      { url: `${BASE_PATH}/apple-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: `${BASE_PATH}/site.webmanifest`,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${BASE_PATH}/`,
    siteName: 'Cerememory',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    images: [
      {
        url: `${BASE_PATH}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Cerememory - A Living Memory Database for the Age of AI',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_PATH}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'CBcDA0b8srBcFKeEHkeDyhDckldYfdR1QRjYWExLy7I',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#02001A' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
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
