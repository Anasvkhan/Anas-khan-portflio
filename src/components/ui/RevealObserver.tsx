"use client";
import { useEffect } from "react";

/** Adds .is-in once to every .rv / .rv-mask / .rv-wave as it enters the viewport. */
export function RevealObserver() {
  useEffect(() => {
    const sel = ".rv, .rv-mask, .rv-wave";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll(sel).forEach((el) => {
        if (!seen.has(el) && !el.classList.contains("is-in")) {
          seen.add(el);
          io.observe(el);
        }
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
