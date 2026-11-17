const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;

export const BASE_PATH =
  envBasePath === undefined ? "/docs/synth" : envBasePath;

export function withBasePath(path = "") {
  if (!path || path === "/") return BASE_PATH || "/";
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export function assetPath(path: string) {
  return withBasePath(path);
}

export function withBasePathForInternalUrl(url: string) {
  if (
    !BASE_PATH ||
    !url.startsWith("/") ||
    url.startsWith("//") ||
    url.startsWith(BASE_PATH)
  ) {
    return url;
  }

  return withBasePath(url);
}

export function toSiteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "https://absmach.eu/docs/synth";
  const normalizedBase = base.replace(/\/$/, "");
  let url: string;
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    url = new URL(path, new URL(base).origin).toString();
  } else {
    url = `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
  }

  return url.endsWith("/") ? url : `${url}/`;
}
