import type { Metadata } from 'next'
import { ja } from '@/i18n'
import HomeContent from '../HomeContent'

const title = ja.meta.title
const description = ja.meta.description
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://co-r-e.github.io'
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${base}/ja`,
    languages: {
      en: `${base}/`,
      ja: `${base}/ja`,
      'x-default': `${base}/`,
    },
  },
  openGraph: {
    title,
    description,
    url: `${baseUrl}${base}/ja`,
    type: 'website',
    siteName: 'Cerememory',
    locale: 'ja_JP',
    alternateLocale: ['en_US'],
    images: [
      {
        url: `${base}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title,
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

export default function JaHome() {
  const pageUrl = `${baseUrl}${base}/ja`

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cerememory',
    alternateName: ['Cerememory Protocol', 'CMP'],
    description,
    url: pageUrl,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Database',
    operatingSystem: 'Linux, macOS, Windows',
    softwareVersion: '0.2.1',
    programmingLanguage: ['Rust', 'Python', 'TypeScript'],
    inLanguage: 'ja',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <HomeContent dict={ja} locale="ja" />
    </>
  )
}
