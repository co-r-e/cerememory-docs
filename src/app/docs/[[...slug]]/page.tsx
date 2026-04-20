import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getPageSource,
  getAllSlugs,
  getPageTree,
  getPrevNextPages,
  getBreadcrumbs,
  getDocsLastModified,
  getPageLastModified,
} from "@/lib/docs/content";
import { compileMdx } from "@/lib/docs/mdx";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { PrevNextLinks } from "@/components/docs/PrevNextLinks";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { absoluteUrl, siteConfig, withBasePath } from "@/lib/site";

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

  if (!slug || slug.length === 0) {
    return {
      title: "Documentation | Cerememory",
      description: siteConfig.docsDescription,
      alternates: {
        canonical: withBasePath("/docs"),
        types: {
          "text/plain": withBasePath("/llms.txt"),
        },
      },
      openGraph: {
        title: "Cerememory Documentation",
        description: siteConfig.docsDescription,
        url: absoluteUrl("/docs"),
        type: "website",
        siteName: siteConfig.name,
        locale: "en_US",
        images: [
          {
            url: withBasePath(siteConfig.socialImagePath),
            width: 1200,
            height: 630,
            alt: "Cerememory Documentation",
            type: "image/png",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Cerememory Documentation",
        description: siteConfig.docsDescription,
        images: [absoluteUrl(siteConfig.socialImagePath)],
      },
    };
  }

  const page = await getPageBySlug(slug);
  if (!page) {
    return { title: "Not Found" };
  }

  const { title, description } = page.frontmatter;
  const pagePath = `/docs/${slug.join("/")}`;
  const fullTitle = `${title} | Cerememory Docs`;
  const lastModified = await getPageLastModified(page.filePath);

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: withBasePath(pagePath),
      types: {
        "text/plain": withBasePath("/llms.txt"),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(pagePath),
      type: "article",
      siteName: siteConfig.name,
      locale: "en_US",
      modifiedTime: lastModified?.toISOString(),
      section: slug.length > 1 ? slug[0].replace(/-/g, " ") : "Documentation",
      tags: slug,
      images: [
        {
          url: withBasePath(siteConfig.socialImagePath),
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
      images: [absoluteUrl(siteConfig.socialImagePath)],
    },
  };
}

export default async function DocsPage({ params }: Props): Promise<ReactNode> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    const [tree, lastModified] = await Promise.all([
      getPageTree(),
      getDocsLastModified(),
    ]);
    const docsUrl = absoluteUrl("/docs");
    const docLinks = tree.flatMap((section) =>
      (section.children ?? []).map((child) => ({
        name: child.title,
        url: child.href ? absoluteUrl(child.href) : docsUrl,
      }))
    );

    const docsIndexJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Cerememory Documentation",
      description: siteConfig.docsDescription,
      url: docsUrl,
      inLanguage: "en",
      dateModified: lastModified.toISOString(),
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: absoluteUrl("/"),
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.logoPath),
        },
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: docLinks.map((entry, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: entry.name,
            url: entry.url,
          })),
      },
    };

    const docsBreadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Docs",
          item: docsUrl,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(docsIndexJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(docsBreadcrumbJsonLd) }}
        />

        <article className="px-6 pt-6 pb-16 lg:px-10">
          <Breadcrumb items={[{ label: "Docs" }]} />

          <header className="mb-10 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--ink)]">
              Cerememory Documentation
            </h1>
            <p className="mt-3 text-lg text-[var(--ink-soft)]">
              {siteConfig.docsDescription}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tree.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-[var(--line)] bg-white/60 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <h2 className="text-lg font-semibold text-[var(--ink)]">
                  {section.title}
                </h2>
                {section.children && section.children.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {section.children.map((child) => (
                      <li key={child.href ?? child.title}>
                        {child.href ? (
                          <Link
                            href={child.href}
                            className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
                          >
                            {child.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-[var(--ink-soft)]">
                            {child.title}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--ink-soft)]">
                    Additional documentation pages will appear here.
                  </p>
                )}
              </section>
            ))}
          </div>
        </article>
      </>
    );
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
  const pageUrl = absoluteUrl(`/docs/${slug.join("/")}`);
  const lastModified = await getPageLastModified(page.filePath);

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.description,
    url: pageUrl,
    inLanguage: "en",
    dateModified: lastModified?.toISOString(),
    image: absoluteUrl(siteConfig.socialImagePath),
    about: slug.map((segment) => segment.replace(/-/g, " ")),
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logoPath),
      },
    },
    mainEntityOfPage: pageUrl,
  };

  const crumbEntries: { name: string; url: string }[] = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Docs", url: absoluteUrl("/docs") },
  ];
  if (slug.length > 1) {
    crumbEntries.push({
      name: breadcrumbs[1]?.label ?? slug[0],
      url: absoluteUrl(`/docs/${slug[0]}`),
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
