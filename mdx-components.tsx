import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Mermaid } from "@/components/mdx/mermaid";
import { assetPath } from "@/lib/base-path";

const DefaultImage = defaultMdxComponents.img as
  | ((props: ComponentPropsWithoutRef<"img">) => ReactNode)
  | undefined;

const DefaultPre = defaultMdxComponents.pre as
  | ((props: ComponentPropsWithoutRef<"pre">) => ReactNode)
  | undefined;

const DOC_IMAGE_PATTERN = /^\/docs\/synth\/(img|diagrams|screenshots)\//;

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as any).props?.children);
  }
  return "";
}

function findMermaid(node: any): { isMermaid: boolean; text: string } {
  if (!node) return { isMermaid: false, text: "" };

  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findMermaid(child);
      if (res.isMermaid) return res;
    }
    return { isMermaid: false, text: "" };
  }

  if (typeof node === "object" && node && "props" in node) {
    const className = String(node.props?.className || "");
    const lang = String(node.props?.["data-language"] || node.props?.lang || "");

    if (
      className.includes("language-mermaid") ||
      className.includes("mermaid") ||
      lang === "mermaid"
    ) {
      return {
        isMermaid: true,
        text: extractText(node.props?.children || node),
      };
    }

    if (node.props?.children) {
      return findMermaid(node.props.children);
    }
  }

  return { isMermaid: false, text: "" };
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: (props) => {
      const preLang = String((props as any)?.["data-language"] || "");
      const preClass = String(props?.className || "");

      if (preLang === "mermaid" || preClass.includes("language-mermaid")) {
        const text = extractText(props.children).trim();
        if (text) return <Mermaid chart={text} />;
      }

      const match = findMermaid(props.children);
      if (match.isMermaid && match.text.trim()) {
        return <Mermaid chart={match.text.trim()} />;
      }

      if (DefaultPre) return <DefaultPre {...props} />;
      return <pre {...props} />;
    },
    img: (props) => {
      if (typeof props.src === "string" && DOC_IMAGE_PATTERN.test(props.src)) {
        const { src, alt, ...rest } = props;
        return (
          <ImageZoom src={src} alt={alt ?? ""}>
            {/* biome-ignore lint/performance/noImgElement: doc content images */}
            <img
              {...rest}
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              className="rounded-lg"
            />
          </ImageZoom>
        );
      }

      const src =
        typeof props.src === "string" ? assetPath(props.src) : props.src;

      if (DefaultImage) return <DefaultImage {...props} src={src} />;
      return null;
    },
    Mermaid,
    ...components,
  };
}
