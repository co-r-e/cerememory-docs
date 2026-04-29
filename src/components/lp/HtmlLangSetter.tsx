"use client";

import { useEffect } from "react";

/**
 * Override the document's lang attribute for routes that aren't English.
 *
 * The root layout sets <html lang="en"> at the document level. Next.js App
 * Router doesn't support per-route <html> overrides without splitting the
 * layout, so localized pages bump the attribute on mount and restore it on
 * unmount. This is the smallest change that gets `lang="ja"` to crawlers,
 * screen readers, and translation extensions for the JA landing page.
 */
export function HtmlLangSetter({ lang }: { lang: string }): null {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const previous = root.getAttribute("lang");
    root.setAttribute("lang", lang);
    return () => {
      if (previous !== null) root.setAttribute("lang", previous);
    };
  }, [lang]);
  return null;
}
