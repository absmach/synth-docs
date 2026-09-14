import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { EditionSwitcher } from "@/components/edition-switcher";
import { Provider } from "@/components/provider";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import "./global.css";
import { baseUrl, createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: {
    template: "%s | Synth",
    default: "Synth Docs",
  },
  description:
    "Synth is an open-source EDA and hardware synthesis platform with placement, routing, DRC, and KiCad integrations.",
  metadataBase: baseUrl,
  openGraph: { url: `${baseUrl}/` },
});

export default function Layout({ children }: { children: ReactNode }) {
  const base = baseOptions();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>
          <DocsLayout
            {...base}
            tree={source.getPageTree()}
            links={base.links?.filter((item) => item.type === "icon")}
            nav={{ ...base.nav }}
            sidebar={{
              banner: <EditionSwitcher />,
            }}
          >
            {children}
          </DocsLayout>
        </Provider>
      </body>
    </html>
  );
}
