import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getPageBySlug,
  getPageSource,
  getAllSlugs,
  getPrevNextPages,
  getBreadcrumbs,
  getFirstPageSlug,
} from "@/lib/docs/content";
import { compileMdx } from "@/lib/docs/mdx";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { PrevNextLinks } from "@/components/docs/PrevNextLinks";
import { TableOfContents } from "@/components/docs/TableOfContents";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/** Generate static paths for all documentation pages. */
export async function generateStaticParams(): Promise<{ slug?: string[] }[]> {
  const slugs = await getAllSlugs();
  return [{ slug: [] }, ...slugs.map((slug) => ({ slug }))];
}

/** Generate metadata for each documentation page. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://co-r-e.github.io";

  if (!slug || slug.length === 0) {
    return {
      title: "Documentation",
      description: "Cerememory documentation: getting started, architecture, the CMP protocol, SDKs, deployment, and reference material.",
      alternates: { canonical: `${base}/docs` },
    };
  }

  const page = await getPageBySlug(slug);
  if (!page) {
    return { title: "Not Found" };
  }

  const { title, description } = page.frontmatter;
  const pagePath = `/docs/${slug.join("/")}`;
  const fullTitle = `${title} | Cerememory Docs`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `${base}${pagePath}`,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${baseUrl}${base}${pagePath}`,
      type: "article",
      siteName: "Cerememory",
      images: [
        {
          url: `${base}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${base}/og-image.png`],
    },
  };
}

export default async function DocsPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;

  // No slug -> redirect to the first page in the docs tree
  if (!slug || slug.length === 0) {
    const firstSlug = await getFirstPageSlug();
    redirect(firstSlug ? `/docs/${firstSlug.join("/")}` : "/");
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const source = await getPageSource(page);
  const { content, frontmatter, toc } = await compileMdx(source);
  const [breadcrumbs, { prev, next }] = await Promise.all([
    getBreadcrumbs(slug),
    getPrevNextPages(slug),
  ]);

  const showToc = frontmatter.toc !== false && toc.length > 0;

  // JSON-LD structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://co-r-e.github.io";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pageUrl = `${baseUrl}${base}/docs/${slug.join("/")}`;

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.description,
    url: pageUrl,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "Cerememory",
      url: `${baseUrl}${base}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "Cerememory",
      url: `${baseUrl}${base}/`,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${base}/logo.svg`,
      },
    },
    mainEntityOfPage: pageUrl,
  };

  const crumbEntries: { name: string; url: string }[] = [
    { name: "Home", url: `${baseUrl}${base}/` },
    { name: "Docs", url: `${baseUrl}${base}/docs` },
  ];
  if (slug.length > 1) {
    crumbEntries.push({
      name: breadcrumbs[1]?.label ?? slug[0],
      url: `${baseUrl}${base}/docs/${slug[0]}`,
    });
  }
  crumbEntries.push({ name: frontmatter.title, url: pageUrl });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbEntries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      item: entry.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex">
        {/* Content column */}
        <article className="min-w-0 flex-1 px-6 pt-6 pb-16 lg:px-10">
          <Breadcrumb items={breadcrumbs} />

          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="mt-2 text-lg text-[var(--ink-soft)]">
                {frontmatter.description}
              </p>
            )}
          </header>

          {/* MDX content */}
          <div className="prose-docs max-w-3xl">{content}</div>

          <PrevNextLinks prev={prev} next={next} />
        </article>

        {/* Table of Contents */}
        {showToc && <TableOfContents entries={toc} />}
      </div>
    </>
  );
}
