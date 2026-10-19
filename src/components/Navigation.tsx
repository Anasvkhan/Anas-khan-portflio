"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { cv } from "@/lib/css";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

const css = `
.nav{position:fixed;inset:0 0 auto 0;z-index:50;pointer-events:none}
.nav>*{pointer-events:auto}
.nav-bar{position:absolute;top:0;left:0;height:2px;width:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;pointer-events:none}
.nav-in{position:relative;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px var(--gutter);max-width:calc(var(--maxw) + var(--gutter)*2);margin-inline:auto;pointer-events:none}
.nav-in>*{pointer-events:auto}
.brand{display:flex;align-items:center;gap:12px;border-radius:999px}
.mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);font-weight:700;font-size:14px;letter-spacing:-.04em;background:transparent;color:var(--ink);transition:background .6s var(--ease),color .6s var(--ease),transform .9s var(--ease)}
.brand:hover .mark{transform:rotate(360deg)}
.nav.is-scrolled .mark{background:var(--ink);color:#fff}
.brand-name{font-weight:600;font-size:15px;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .5s var(--ease)}
.nav.is-scrolled .brand-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.pill{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);transition:background .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
.nav.is-scrolled .pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -14px rgba(13,13,13,.25)}
.pill a{position:relative;z-index:1;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:-.01em;color:var(--ink-2);transition:color .4s var(--ease)}
.pill a.on{color:#fff}
.ind{position:absolute;z-index:0;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);opacity:0;transform:translateX(var(--x,0));width:var(--w,0);transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s}
.ind.show{opacity:1}
.menu-btn{display:none;height:42px;padding-inline:20px;border-radius:999px;font-weight:600;font-size:14px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line)}
.ov{position:fixed;inset:0;z-index:60;background:var(--paper);clip-path:inset(0 0 100% 0);transition:clip-path .9s var(--ease);visibility:hidden;display:flex;flex-direction:column;padding:16px var(--gutter) 32px}
.ov.open{clip-path:inset(0);visibility:visible}
.ov-top{display:flex;justify-content:space-between;align-items:center}
.ov-list{margin:auto 0;display:flex;flex-direction:column;gap:2px;list-style:none;padding:0}
.ov-list a{display:flex;align-items:baseline;gap:16px;padding:6px 0;font-size:clamp(40px,12vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.05;opacity:0;transform:translateY(40px);transition:opacity .8s var(--ease),transform .8s var(--ease)}
.ov.open .ov-list a{opacity:1;transform:none;transition-delay:calc(.25s + var(--i)*70ms)}
.ov-list small{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:.05em;color:var(--mute)}
.ov-foot{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
@media (max-width:820px){.nav::before{content:"";position:absolute;inset:0 0 auto 0;height:72px;background:rgba(244,242,238,.84);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);opacity:0;transition:opacity .4s var(--ease);border-bottom:1px solid var(--line)}.nav.is-scrolled::before{opacity:1}.pill{display:none}.menu-btn{display:block}.brand-name{display:none}}
`;

export function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);

  // scroll state + progress bar
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
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
    };
  }, []);

  // active section
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById("top");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target === hero ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  // sliding indicator
  const place = useCallback(() => {
    const pill = pillRef.current;
    const ind = indRef.current;
    if (!pill || !ind) return;
    const link = active ? pill.querySelector<HTMLElement>(`a[data-id="${active}"]`) : null;
    if (!link) return ind.classList.remove("show");
    ind.style.setProperty("--x", `${link.offsetLeft}px`);
    ind.style.setProperty("--w", `${link.offsetWidth}px`);
    ind.classList.add("show");
  }, [active]);
  useLayoutEffect(place, [place]);
  useEffect(() => {
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  // overlay: lock scroll, Esc
  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToTarget(id), open ? 350 : 0);
  };

  return (
    <>
      <style>{css}</style>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-bar" ref={barRef} aria-hidden="true" />
        <div className="nav-in">
          <a href="#top" className="brand" onClick={go("top")} aria-label={PROFILE.name}>
            <span className="mark" aria-hidden="true">{PROFILE.initials}</span>
            <span className="brand-name">{PROFILE.name}</span>
          </a>
          <nav className="pill" aria-label="Primary" ref={pillRef}>
            <span className="ind" ref={indRef} aria-hidden="true" />
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                data-id={n.id}
                className={active === n.id ? "on" : ""}
                aria-current={active === n.id ? "true" : undefined}
                onClick={go(n.id)}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <button className="menu-btn" aria-expanded={open} aria-controls="menu-ov" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>

      <div id="menu-ov" className={`ov${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <div className="ov-top">
          <span className="mark">{PROFILE.initials}</span>
          <button className="menu-btn" style={{ display: "block" }} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <ul className="ov-list">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} style={cv({ "--i": i })} onClick={go(n.id)}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="ov-foot">{PROFILE.email}</p>
      </div>
    </>
  );
}
