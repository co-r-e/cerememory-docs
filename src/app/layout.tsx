import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Figtree, JetBrains_Mono } from 'next/font/google'
import { absoluteUrl, getSiteUrl, siteConfig, withBasePath } from '@/lib/site'
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

const SITE_URL = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
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
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: withBasePath('/'),
    languages: {
      en: withBasePath('/'),
      ja: withBasePath('/ja'),
      'x-default': withBasePath('/'),
    },
    types: {
      'text/plain': withBasePath('/llms.txt'),
    },
  },
  icons: {
    icon: [
      { url: withBasePath('/favicon.ico'), sizes: 'any', type: 'image/x-icon' },
      { url: withBasePath('/favicon-48.png'), sizes: '48x48', type: 'image/png' },
      { url: withBasePath('/icon.svg'), sizes: 'any', type: 'image/svg+xml' },
      { url: withBasePath('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { url: withBasePath('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [withBasePath('/favicon.ico')],
    apple: [
      { url: withBasePath('/apple-icon.png'), sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: withBasePath('/manifest.webmanifest'),
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    images: [
      {
        url: withBasePath(siteConfig.socialImagePath),
        width: 1200,
        height: 630,
        alt: siteConfig.title,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl(siteConfig.socialImagePath)],
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
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColorLight },
    { media: '(prefers-color-scheme: dark)', color: siteConfig.themeColorDark },
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
