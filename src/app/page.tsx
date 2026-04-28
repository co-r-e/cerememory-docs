import type { Metadata } from 'next'
import { en } from '@/i18n'
import { absoluteUrl, siteConfig, withBasePath } from '@/lib/site'
import HomeContent from './HomeContent'

export const metadata: Metadata = {
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
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    // Image is supplied by src/app/opengraph-image.tsx.
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    // Image is supplied by src/app/twitter-image.tsx.
  },
}

export default function Home() {
  const homeUrl = absoluteUrl('/')

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    alternateName: ['Cerememory Protocol', 'CMP'],
    description: siteConfig.description,
    url: homeUrl,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Database',
    operatingSystem: 'Linux, macOS, Windows',
    softwareVersion: '0.2.5',
    programmingLanguage: ['Rust'],
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
      url: homeUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: homeUrl,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteConfig.logoPath),
      },
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: homeUrl,
    description: siteConfig.description,
    inLanguage: ['en', 'ja'],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: homeUrl,
    },
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: homeUrl,
    logo: absoluteUrl(siteConfig.logoPath),
    sameAs: [siteConfig.repoUrl],
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
