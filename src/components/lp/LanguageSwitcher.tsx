'use client'

import type { Locale } from '@/i18n/config'
import { basePath } from '@/lib/basePath'

interface Props {
  locale: Locale
  label: string
}

export function LanguageSwitcher({ locale, label }: Props) {
  const targetHref = locale === 'ja' ? `${basePath}/` : `${basePath}/ja`

  return (
    <a
      href={targetHref}
      className="lang-switcher"
      aria-label={locale === 'ja' ? 'Switch to English' : '日本語に切り替え'}
    >
      {label}
    </a>
  )
}
