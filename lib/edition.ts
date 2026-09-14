export interface DocEdition {
  label: string;
  value: string;
  path: string;
}

export const DOC_EDITIONS: DocEdition[] = [
  {
    label: "Enterprise Edition",
    value: "enterprise",
    path: "/docs/synth/",
  },
  {
    label: "Community Edition",
    value: "community",
    path: "/docs/synth/community/",
  },
];

export const CURRENT_EDITION: "community" | "enterprise" =
  process.env.NEXT_PUBLIC_EDITION === "community" ? "community" : "enterprise";
