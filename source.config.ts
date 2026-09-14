import { remarkAdmonition, remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `new: true` marks a page as recently added badge
    // `enterprise: true` marks a page as Enterprise Edition only; filtered out of Community Edition build
    schema: pageSchema.extend({
      new: z.boolean().optional(),
      enterprise: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    // `enterprise: true` marks a whole folder (and its descendants) as Enterprise Edition only
    schema: metaSchema.extend({
      enterprise: z.boolean().optional(),
    }),
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
    remarkPlugins: [remarkAdmonition, remarkMdxMermaid],
  },
});

