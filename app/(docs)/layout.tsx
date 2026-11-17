import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs-shell";
import { source } from "@/lib/source";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell home="/" tree={source.getPageTree()}>
      {children}
    </DocsShell>
  );
}
