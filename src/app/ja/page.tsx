import type { Metadata } from 'next'
import { ja } from '@/i18n'
import { absoluteUrl, siteConfig, withBasePath } from '@/lib/site'
import HomeContent from '../HomeContent'

const title = siteConfig.japaneseTitle
const description = siteConfig.japaneseDescription

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: withBasePath('/ja'),
    languages: {
      en: withBasePath('/'),
      ja: withBasePath('/ja'),
      'x-default': withBasePath('/'),
    },
    types: {
      'text/plain': withBasePath('/llms.txt'),
    },
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/ja'),
    type: 'website',
    siteName: siteConfig.name,
    locale: 'ja_JP',
    alternateLocale: ['en_US'],
    images: [
      {
        url: withBasePath(siteConfig.socialImagePath),
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
    images: [absoluteUrl(siteConfig.socialImagePath)],
  },
}

export default function JaHome() {
  const pageUrl = absoluteUrl('/ja')

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    alternateName: ['Cerememory Protocol', 'CMP'],
    description,
    url: pageUrl,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Database',
    operatingSystem: 'Linux, macOS, Windows',
    softwareVersion: '0.2.2',
    programmingLanguage: ['Rust', 'Python', 'TypeScript'],
    inLanguage: 'ja',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    license: 'https://opensource.org/licenses/MIT',
    codeRepository: siteConfig.repoUrl,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteConfig.logoPath),
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
