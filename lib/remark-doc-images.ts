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
const IMAGE_BASE_PATH = "/docs/synth";

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
      if (node.url.startsWith(IMAGE_BASE_PATH)) return;

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
