"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          fontFamily: "inherit",
          theme: resolvedTheme === "dark" ? "dark" : "default",
        });

        const cleanId = id.replace(/[^a-zA-Z0-9]/g, "");
        const elementId = `mermaid_${cleanId}_${Date.now()}`;
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(
          elementId,
          chart.replaceAll("\\n", "\n"),
        );

        if (!cancelled) {
          setSvg(renderedSvg);
          requestAnimationFrame(() => {
            if (containerRef.current && !cancelled) {
              bindFunctions?.(containerRef.current);
            }
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    setSvg(null);
    setError(null);
    render();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, id]);

  if (error) {
    return (
      <pre className="my-6 p-4 rounded-xl text-red-500 text-sm bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 overflow-auto">
        Mermaid error: {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 p-8 rounded-xl border bg-fd-card text-fd-muted-foreground flex items-center justify-center text-sm">
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 p-6 rounded-xl border bg-fd-card/50 backdrop-blur-xs flex justify-center overflow-x-auto [&_svg]:w-full [&_svg]:max-w-full [&_svg]:h-auto"
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid renders trusted SVG output */
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
