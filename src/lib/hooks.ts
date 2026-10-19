"use client";
import { RefObject, useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has entered the viewport (stays true unless `once` is false). */
export function useInView<T extends Element>(ref: RefObject<T | null>, threshold = 0.2, once = true) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

/**
 * Calls `cb(progress)` on scroll/resize (rAF-throttled) where progress runs 0→1 while the element
 * travels through the viewport. `mode: "pin"` maps a tall sticky section instead.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  cb: (p: number, rect: DOMRect) => void,
  mode: "through" | "pin" = "through",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "pin"
          ? -r.top / Math.max(1, r.height - vh)
          : (vh * 0.55 - r.top) / Math.max(1, r.height + vh * 0.1);
      cb(Math.min(1, Math.max(0, p)), r);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, cb, mode]);
}
