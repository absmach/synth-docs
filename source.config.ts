import { remarkAdmonition, remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";
import { remarkDocImages } from "./lib/remark-doc-images";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `new: true` marks a page as recently added badge
    schema: pageSchema.extend({
      new: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkImageOptions: false,
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "typescript",
        "bash",
        "javascript",
        "rust",
        "json",
        "toml",
        "yaml",
        "mermaid",
      ],
    },
    remarkPlugins: [remarkAdmonition, remarkMdxMermaid, remarkDocImages],
  },
});
