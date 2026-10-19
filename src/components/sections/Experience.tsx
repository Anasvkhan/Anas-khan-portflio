"use client";
import { useCallback, useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { cv } from "@/lib/css";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { SectionHead } from "@/components/ui/SectionHead";

const css = `
.tl{position:relative;margin-top:72px}
.sp{position:absolute;top:8px;bottom:8px;left:189px;width:2px;background:var(--line);border-radius:2px}
.sp i{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0));border-radius:2px}
.stop{position:relative;display:grid;grid-template-columns:170px 40px minmax(0,1fr);gap:0;padding-bottom:clamp(44px,7vh,76px);}
.st-c{transition:transform .9s var(--ease)}
.stop:not(.lit) .st-c{transform:translateX(-10px)}
.st-y{font-family:var(--font-mono);font-size:13px;letter-spacing:.02em;color:var(--mute);padding-top:2px;text-align:left}
.st-y b{display:block;font-weight:500;color:var(--ink);font-size:15px;margin-bottom:4px}
.st-d{position:relative}
.st-d::before{content:"";position:absolute;left:12px;top:6px;width:16px;height:16px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:background .6s var(--ease),box-shadow .6s var(--ease),transform .6s var(--ease)}
.stop.lit .st-d::before{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.1)}
.st-c{padding-left:12px;max-width:62ch}
.st-c h3{font-size:clamp(24px,3vw,40px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
.st-c .plc{margin-top:8px;font-size:16px;font-weight:500;color:var(--ink-2);letter-spacing:-.01em}
.st-c p.dt{margin-top:12px;font-size:15px;color:var(--mute);line-height:1.55}
.nx{margin-left:210px;border-radius:26px;border:1.5px dashed rgba(13,13,13,.25);padding:clamp(24px,4vw,40px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px}
.nx h3{font-size:clamp(28px,4vw,52px);font-weight:700;letter-spacing:-.045em;line-height:1}
.nx small{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);display:block;margin-bottom:10px}
@media (max-width:760px){
  .sp{left:13px}
  .stop{grid-template-columns:28px minmax(0,1fr)}
  .st-y{grid-column:2;grid-row:1;margin-bottom:6px}
  .st-d{grid-column:1;grid-row:1 / span 2}
  .st-d::before{left:5px}
  .st-c{grid-column:2;padding-left:0}
  .nx{margin-left:28px}
}
`;

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useCallback((_p: number, r: DOMRect) => {
    const el = ref.current;
    if (!el) return;
    const line = window.innerHeight * 0.55;
    const p = Math.min(1, Math.max(0, (line - r.top) / (r.height - 80)));
    el.style.setProperty("--p", p.toFixed(4));
    el.querySelectorAll<HTMLElement>(".stop").forEach((s) => {
      s.classList.toggle("lit", r.top + s.offsetTop + 14 < line);
    });
  }, []);
  useScrollProgress(ref, cb);

  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="exp-h">
          <SectionHead n="04" label="Education & experience" lines={["The path so"]} accent="far." />
        </div>
        <div className="tl" ref={ref}>
          <div className="sp" aria-hidden="true">
            <i />
          </div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {TIMELINE.map((e) => (
              <li key={e.period + e.title} className="stop">
                <div className="st-y">
                  <b>{e.period}</b>
                  {e.kind}
                </div>
                <div className="st-d" aria-hidden="true" />
                <div className="st-c">
                  <h3>{e.title}</h3>
                  <p className="plc">{e.place}</p>
                  <p className="dt">{e.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="nx rv">
            <div>
              <small>Next</small>
              <h3>
                Your <em className="accent">team?</em>
              </h3>
            </div>
            <a
              className="btn btn-primary"
              href="#contact"
              style={cv({})}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              Let&apos;s talk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
