import { dirname, join, normalize, relative } from "node:path";

interface MdastNode {
  type?: string;
  url?: string;
  children?: MdastNode[];
}
interface CompileFile {
  path: string;
}

// Doc content images live in the shared R2 bucket (see workers/image-proxy.ts).
// Authors keep writing plain markdown image syntax; this rewrites image URLs at
// compile time into the canonical same-origin Worker path.
const CONTENT_ROOT = join(process.cwd(), "content/docs");

// In production the site is served under /docs/synth, so images go through
// the Worker/R2 route. During local dev the site is at the root and the images
// are served from public/screenshots. Both editions share the same image path.
const IS_DEV = process.env.NODE_ENV === "development";
const IMAGE_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (IS_DEV ? "" : "/docs/synth");

function walk(node: MdastNode, visitor: (node: MdastNode) => void) {
  if (node.type === "image") visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visitor);
  }
}

export function remarkDocImages() {
  return (tree: MdastNode, file: CompileFile) => {
    walk(tree, (node) => {
      if (typeof node.url !== "string" || node.url.length === 0) return;
      if (/^https?:\/\//.test(node.url)) return;
      if (IMAGE_BASE_PATH && node.url.startsWith(IMAGE_BASE_PATH)) return;

      if (node.url.startsWith("/")) {
        node.url = `${IMAGE_BASE_PATH}${node.url}`;
        return;
      }

      const fileDir = dirname(file.path);
      const absolute = normalize(join(fileDir, node.url));
      const relativeToContent = relative(CONTENT_ROOT, absolute);
      node.url = `${IMAGE_BASE_PATH}/${relativeToContent.split("\\").join("/")}`;
    });
  };
}
