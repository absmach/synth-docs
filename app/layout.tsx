import type { ReactNode } from "react";
import { Provider } from "@/components/provider";
import { baseUrl, createMetadata } from "@/lib/metadata";
import "./global.css";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
