import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { NewBadge } from "@/components/mdx/new-badge";
import { baseUrl } from "@/lib/metadata";
import type { DocsPage as DocsPageType, DocsSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export function buildBreadcrumbSchema(pageUrl: string, title: string) {
  const base = baseUrl.toString().replace(/\/$/, "");
  const segments = pageUrl.split("/").filter(Boolean);
  const items: {
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: new URL(base).origin,
    },
    { "@type": "ListItem", position: 2, name: "Docs", item: base },
  ];

  // The last segment is the page itself, which has no URL entry of its own.
  for (let i = 0; i < segments.length - 1; i++) {
    const name = segments[i]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name,
      item: `${base}/${segments.slice(0, i + 1).join("/")}`,
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: title,
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function DocPageView({
  source,
  page,
}: {
  source: DocsSource;
  page: DocsPageType;
}) {
  const MDX = page.data.body;
  const breadcrumb = buildBreadcrumbSchema(page.url, page.data.title);
  const components = getMDXComponents({
    a: createRelativeLink(source, page),
  });

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled static JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <div className="flex items-start justify-between gap-4">
          <DocsTitle>{page.data.title}</DocsTitle>
          {page.data.new && <NewBadge className="mt-2" />}
        </div>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={components} />
        </DocsBody>
      </DocsPage>
    </>
  );
}
