import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import type { source } from "@/lib/source";

type PageTree = ReturnType<typeof source.getPageTree>;

export function DocsShell({
  home,
  tree,
  children,
}: {
  home: string;
  tree: PageTree;
  children: ReactNode;
}) {
  const base = baseOptions();
  return (
    <DocsLayout
      {...base}
      tree={tree}
      links={base.links?.filter((item) => item.type === "icon")}
      nav={{ ...base.nav, url: home }}
    >
      {children}
    </DocsLayout>
  );
}
