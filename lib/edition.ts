export interface DocEdition {
  label: string;
  value: string;
  path: string;
}

// `NEXT_PUBLIC_BASE_PATH` is empty during local development (root), the
// deployed enterprise path in production, and the community sub-path in the
// community build. Derive both edition URLs from it so switching editions
// works in every deployment.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/docs/synth";
const COMMUNITY_SUFFIX = "/community";
const ENTERPRISE_BASE_PATH = BASE_PATH.endsWith(COMMUNITY_SUFFIX)
  ? BASE_PATH.slice(0, -COMMUNITY_SUFFIX.length) || "/"
  : BASE_PATH || "/";
const ENTERPRISE_PREFIX =
  ENTERPRISE_BASE_PATH === "/" ? "" : ENTERPRISE_BASE_PATH;

export const DOC_EDITIONS: DocEdition[] = [
  {
    label: "Enterprise Edition",
    value: "enterprise",
    path: `${ENTERPRISE_PREFIX}/`,
  },
  {
    label: "Community Edition",
    value: "community",
    path: `${ENTERPRISE_PREFIX}${COMMUNITY_SUFFIX}/`,
  },
];

export const CURRENT_EDITION: "community" | "enterprise" =
  process.env.NEXT_PUBLIC_EDITION === "community" ? "community" : "enterprise";
