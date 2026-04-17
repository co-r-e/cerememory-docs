import type { Metadata } from 'next'
import { en } from '@/i18n'
import HomeContent from './HomeContent'

const title = 'Cerememory - A Living Memory Database for the Age of AI'
const description =
  'Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory across sessions. LLM-agnostic (Claude, GPT, Gemini), user-sovereign, brain-inspired, and built in Rust. Speaks CMP over HTTP, gRPC, and MCP.'
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://co-r-e.github.io'
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${base}/`,
    languages: {
      en: `${base}/`,
      ja: `${base}/ja`,
      'x-default': `${base}/`,
    },
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}${base}/`,
    type: 'website',
    siteName: 'Cerememory',
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    images: [
      {
        url: `${base}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Cerememory - A Living Memory Database for the Age of AI',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${base}/og-image.png`],
  },
}

export default function Home() {
  const homeUrl = `${baseUrl}${base}/`

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cerememory',
    alternateName: ['Cerememory Protocol', 'CMP'],
    description,
    url: homeUrl,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Database',
    operatingSystem: 'Linux, macOS, Windows',
    softwareVersion: '0.2.1',
    programmingLanguage: ['Rust', 'Python', 'TypeScript'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: 'https://github.com/co-r-e/cerememory',
    author: {
      '@type': 'Organization',
      name: 'Cerememory',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cerememory',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${base}/logo.svg`,
      },
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cerememory',
    url: homeUrl,
    description,
    inLanguage: ['en', 'ja'],
    publisher: {
      '@type': 'Organization',
      name: 'Cerememory',
      url: baseUrl,
    },
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cerememory',
    url: baseUrl,
    logo: `${baseUrl}${base}/logo.svg`,
    sameAs: ['https://github.com/co-r-e/cerememory'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeContent dict={en} locale="en" />
    </>
  )
}
