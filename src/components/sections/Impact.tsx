"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data";
import { cv } from "@/lib/css";
import { prefersReducedMotion, useInView, useScrollProgress } from "@/lib/hooks";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo, brandOf, isBrand } from "@/components/ui/TechLogo";

const css = `
.imp{position:relative}
.pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,4vh,44px);padding-top:76px}
.imp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.imp-head .h-section{font-size:clamp(36px,5.2vw,76px)}
.imp-head .tag{margin-bottom:14px}
.prog{width:min(260px,30vw);height:2px;background:var(--line);border-radius:2px;overflow:hidden;margin-bottom:14px}
.prog i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--p,0))}
@media (max-width:700px){.imp-head{flex-direction:column;align-items:stretch;gap:0}.prog{width:100%;margin:14px 0 0}.pin{gap:14px}.imp-head .h-section{font-size:clamp(34px,10vw,48px)}}
.track{display:flex;gap:clamp(14px,2vw,24px);padding-inline:max(var(--gutter),calc((100vw - var(--maxw))/2));width:max-content;will-change:transform;padding-block:20px}
.cd{container-type:inline-size;position:relative;flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 14px 30px -22px rgba(13,13,13,.18);padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
.cd.is-centre{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -28px rgba(13,13,13,.32)}
.cd-t{display:flex;justify-content:space-between;align-items:flex-start}
.lg{position:relative;width:72px;height:72px;display:grid;place-items:center;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink)}
.lg .gl{position:absolute;inset:-16px;border-radius:50%;opacity:.5;filter:blur(10px);transition:opacity .8s var(--ease);z-index:0}
.cd.is-centre .gl{opacity:1}
.lg>*:not(.gl){position:relative;z-index:1}
.ix{font-family:var(--font-mono);font-size:12px;color:var(--mute);letter-spacing:.06em}
.cd-b{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.cd-b .tx{min-width:0;flex:1}
.cd-b h3{font-size:clamp(17px,1.5vw,20px);font-weight:700;letter-spacing:-.03em;line-height:1.1}
.cd-b p{margin-top:6px;font-size:13px;line-height:1.35;color:var(--ink-2)}
.cd-b small{display:block;margin-top:8px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.04em;color:var(--mute)}
.bignum{font-size:clamp(64px,8.4vw,116px);font-weight:700;letter-spacing:-.06em;line-height:.8;font-variant-numeric:tabular-nums;white-space:nowrap}
.bignum sup{font-size:.5em;vertical-align:top;letter-spacing:-.02em;font-weight:600;margin-left:.04em;position:relative;top:.05em}
@container (max-width:459px){.cd-b{flex-direction:column-reverse;align-items:flex-start;gap:10px}.bignum{font-size:60px}}
.end{flex:none;display:flex;align-items:center;padding:0 clamp(24px,5vw,80px) 0 12px;font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.045em;white-space:nowrap}
.end em{margin-right:.25em}
`;

function Card({ a, i, total }: { a: (typeof ACHIEVEMENTS)[number]; i: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, 0.55);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) return setN(a.value);
    let raf = 0;
    const t0 = performance.now();
    const run = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setN(Math.round(a.value * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [seen, a.value]);
  const brand = isBrand(a.icon) ? brandOf(a.icon) : null;
  return (
    <article ref={ref} className="cd">
      <div className="cd-t">
        <div className="lg">
          <span className="gl" style={{ background: brand ? `radial-gradient(closest-side,#${brand.hex}40,transparent)` : "radial-gradient(closest-side,rgba(13,13,13,.14),transparent)" }} />
          <TechLogo name={a.icon} size={36} />
        </div>
        <span className="ix">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="cd-b">
        <div className="tx">
          <h3>{a.label}</h3>
          <p>{a.caption}</p>
          <small>{a.detail}</small>
        </div>
        <div className="bignum">
          <span className="sr-only">
            {a.value}
            {a.suffix}
          </span>
          <span aria-hidden="true">
            {n}
            {a.suffix && <sup>{a.suffix}</sup>}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Impact() {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const travel = useRef(0);
  const [h, setH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      travel.current = Math.max(0, t.scrollWidth - window.innerWidth);
      setH(window.innerHeight + travel.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const cb = useCallback((p: number) => {
    const t = track.current;
    if (!t) return;
    t.style.transform = `translate3d(${(-p * travel.current).toFixed(1)}px,0,0)`;
    bar.current?.style.setProperty("--p", p.toFixed(4));
    const mid = window.innerWidth / 2;
    let best: Element | null = null;
    let bd = Infinity;
    t.querySelectorAll(".cd").forEach((c) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) {
        bd = d;
        best = c;
      }
      c.classList.remove("is-centre");
    });
    (best as Element | null)?.classList.add("is-centre");
  }, []);
  useScrollProgress(sec, cb, "pin");

  return (
    <section id="impact" ref={sec} className="imp" style={{ height: h }} aria-labelledby="imp-h">
      <style>{css}</style>
      <div className="pin">
        <div className="wrap" style={{ width: "100%" }}>
          <div className="imp-head">
            <div id="imp-h">
              <SectionHead n="05" label="Impact in numbers" lines={["Numbers that"]} accent="moved." />
            </div>
            <div className="prog rv" ref={bar} aria-hidden="true">
              <i />
            </div>
          </div>
        </div>
        <div className="track" ref={track} style={cv({})}>
          {ACHIEVEMENTS.map((a, i) => (
            <Card key={a.label} a={a} i={i} total={ACHIEVEMENTS.length} />
          ))}
          <div className="end">
            <span>
              <em className="accent">and</em>counting →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
