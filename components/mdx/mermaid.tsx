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
  const bindFunctionsRef = useRef<((element: Element) => void) | undefined>(
    undefined,
  );
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mermaid's `bindFunctions` attaches tooltips and click handlers by querying
  // the rendered SVG. Run it after React commits the markup; calling it from a
  // requestAnimationFrame inside the render effect can bind before the SVG is
  // in the DOM and silently skip every handler.
  useEffect(() => {
    if (svg && containerRef.current) {
      bindFunctionsRef.current?.(containerRef.current);
    }
  }, [svg]);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        // Mermaid calls `selection.transition()` for node tooltips, but d3
        // marks itself side-effect free, so bundlers drop the d3-transition
        // import that installs that method. Import it before mermaid renders
        // or hovering a node with a tooltip throws
        // "tooltipElem.transition is not a function".
        await import("d3-transition");
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
          bindFunctionsRef.current = bindFunctions;
          setSvg(renderedSvg);
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
