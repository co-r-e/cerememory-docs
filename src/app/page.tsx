import type { Metadata } from 'next'
import HomeContent from './HomeContent'

const title = 'Cerememory — A Living Memory Database for the Age of AI'
const description =
  'Cerememory is an open-source, neuroscience-inspired memory database that gives AI systems persistent, evolving memory. LLM-agnostic. User-sovereign. Brain-inspired.'
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${base}/`,
  },
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Cerememory',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cerememory.dev'
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cerememory',
    description,
    url: `${baseUrl}${base}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Linux, macOS, Windows',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    license: 'https://opensource.org/licenses/MIT',
    publisher: {
      '@type': 'Organization',
      name: 'Cerememory',
      url: baseUrl,
    },
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <HomeContent />
    </>
  )
}
