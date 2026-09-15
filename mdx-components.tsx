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

type MdxNodeWithProps = {
  props?: {
    children?: ReactNode;
    className?: string;
    "data-language"?: string;
    lang?: string;
  };
};

type PreProps = ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
};

function getNodeProps(node: ReactNode): MdxNodeWithProps["props"] | undefined {
  if (node && typeof node === "object" && "props" in node) {
    return (node as MdxNodeWithProps).props;
  }
  return undefined;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  const props = getNodeProps(node);
  if (props) return extractText(props.children);
  return "";
}

function findMermaid(node: ReactNode): { isMermaid: boolean; text: string } {
  if (!node) return { isMermaid: false, text: "" };

  if (Array.isArray(node)) {
    for (const child of node) {
      const res = findMermaid(child);
      if (res.isMermaid) return res;
    }
    return { isMermaid: false, text: "" };
  }

  const props = getNodeProps(node);
  if (props) {
    const className = String(props.className || "");
    const lang = String(props["data-language"] || props.lang || "");

    if (
      className.includes("language-mermaid") ||
      className.includes("mermaid") ||
      lang === "mermaid"
    ) {
      return {
        isMermaid: true,
        text: extractText(props.children || node),
      };
    }

    if (props.children) {
      return findMermaid(props.children);
    }
  }

  return { isMermaid: false, text: "" };
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: (props) => {
      const preLang = String((props as PreProps)?.["data-language"] || "");
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
