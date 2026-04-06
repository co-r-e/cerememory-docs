import type { Metadata } from 'next'
import { ja } from '@/i18n'
import HomeContent from '../HomeContent'

const title = ja.meta.title
const description = ja.meta.description
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${base}/ja`,
  },
  openGraph: {
    title,
    description,
    type: 'website',
    siteName: 'Cerememory',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function JaHome() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cerememory.dev'
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cerememory',
    description,
    url: `${baseUrl}${base}/ja`,
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
      <HomeContent dict={ja} locale="ja" />
    </>
  )
}
