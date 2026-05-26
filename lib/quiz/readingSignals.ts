import { useEffect, useRef } from "react";
import { ReadingSignals } from "./types";

// Median expected times in seconds per content type (tune these)
const MEDIAN_TIMES = {
  formula: 45,
  example: 30,
  definition: 20,
};

export function useReadingSignals(
  sectionId: string,
  onUnmount: (signals: ReadingSignals) => void
) {
  const times = useRef<Record<string, number>>({});
  const starts = useRef<Record<string, number>>({});
  const reopened = useRef(false);

  useEffect(() => {
    // Track time spent on each content-typed block in the section
    // Each block has a data-content-type="formula|example|definition" attribute
    const blocks = document.querySelectorAll(`#${sectionId} [data-content-type]`);
    const observers: IntersectionObserver[] = [];

    blocks.forEach(block => {
      const type = block.getAttribute("data-content-type") as string;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          starts.current[type] = Date.now();
        } else if (starts.current[type]) {
          times.current[type] = (times.current[type] ?? 0) +
            (Date.now() - starts.current[type]) / 1000;
        }
      }, { threshold: 0.5 });
      obs.observe(block);
      observers.push(obs);
    });

    // Track definition reopen (clicking a callout toggle)
    const defBlocks = document.querySelectorAll(`#${sectionId} [data-content-type="definition"]`);
    const clickHandler = () => { reopened.current = true; };
    defBlocks.forEach(b => b.addEventListener("click", clickHandler));

    return () => {
      observers.forEach(o => o.disconnect());
      defBlocks.forEach(b => b.removeEventListener("click", clickHandler));

      onUnmount({
        formulaTimeRatio: (times.current["formula"] ?? 0) / MEDIAN_TIMES.formula,
        exampleTimeRatio: (times.current["example"] ?? 0) / MEDIAN_TIMES.example,
        definitionTimeRatio: (times.current["definition"] ?? 0) / MEDIAN_TIMES.definition,
        definitionReopened: reopened.current,
      });
    };
  }, [sectionId]);
}