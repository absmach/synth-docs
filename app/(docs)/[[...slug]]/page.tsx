import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPageView } from "@/components/doc-page";
import { docMetadata } from "@/lib/doc-metadata";
import { source } from "@/lib/source";

type ParamProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: ParamProps) {
  const params = await props.params;
  const slug = params.slug && params.slug.length > 0 ? params.slug : [];

  // The root catch-all has no page of its own; the only fallback is the
  // landing page for `/`. Every other unknown slug is a real 404, not a
  // silently served Quick Start with a 200.
  const page =
    source.getPage(slug) ??
    (slug.length === 0
      ? source.getPage(["user-guide", "quick-start"])
      : undefined);
  if (!page) notFound();

  return <DocPageView source={source} page={page} />;
}

export async function generateStaticParams() {
  return [{ slug: [] }, ...source.generateParams()];
}

export async function generateMetadata(props: ParamProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];

  const page = source.getPage(slug);
  if (!page) {
    return { title: "Synth Docs" };
  }

  return docMetadata(page);
}
