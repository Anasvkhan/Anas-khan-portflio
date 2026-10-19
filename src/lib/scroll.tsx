"use client";
import Lenis from "lenis";
import { createContext, useContext, useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

/** Smooth-scroll to an element id (or "top"), falling back to native scrolling. */
export function scrollToTarget(target: string | number, offset = 0) {
  const el = typeof target === "string" && target !== "top" ? document.getElementById(target) : null;
  const y = typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
  if (lenis) lenis.scrollTo(y, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

const Ctx = createContext(false);
export const useSmooth = () => useContext(Ctx);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return <Ctx.Provider value={true}>{children}</Ctx.Provider>;
}
