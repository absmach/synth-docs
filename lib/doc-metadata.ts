import type { Metadata } from "next";
import { toSiteUrl } from "@/lib/base-path";
import { type DocsPage, getPageImage } from "@/lib/source";

export function docMetadata(page: DocsPage): Metadata {
  const canonical = toSiteUrl(page.url);
  return {
    title: page.data.title,
    description:
      page.data.description ??
      "Complete technical documentation for Synth - open source EDA, placement, routing, and KiCad integrations.",
    alternates: { canonical },
    openGraph: {
      url: canonical,
      images: getPageImage(page).url,
    },
  };
}
