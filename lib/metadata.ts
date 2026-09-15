import type { Metadata } from "next/types";

export const baseUrl = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || "https://absmach.eu/docs/synth",
);

function resolveTitle(title: Metadata["title"]): string {
  if (!title) return "Synth — Open-Source EDA & Hardware Synthesis Platform";
  if (typeof title === "string") return title;
  if ("default" in title && title.default) return title.default;
  return "Synth — Open-Source EDA & Hardware Synthesis Platform";
}

export function createMetadata(override: Metadata, ogSlug = "synth"): Metadata {
  const ogUrl = `${baseUrl.toString()}/og/${ogSlug}/image.webp`;
  const resolvedTitle = resolveTitle(override.title);
  const canonicalUrl =
    override.alternates?.canonical ??
    (override.openGraph?.url as string | URL | undefined);
  const alternates = canonicalUrl
    ? {
        ...override.alternates,
        canonical: canonicalUrl,
      }
    : override.alternates;
  const openGraphUrl = override.openGraph?.url;
  return {
    ...override,
    ...(alternates ? { alternates } : {}),
    openGraph: {
      title: resolvedTitle,
      description: override.description ?? undefined,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Synth — Open Source EDA Platform",
        },
      ],
      siteName: "Synth",
      ...(openGraphUrl ? { url: openGraphUrl } : {}),
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: "@absmach",
      creator: "@absmach",
      title: resolvedTitle,
      description: override.description ?? undefined,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Synth — Open Source EDA Platform",
        },
      ],
      ...override.twitter,
    },
  };
}
