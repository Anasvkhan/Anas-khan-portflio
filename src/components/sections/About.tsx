"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { cv } from "@/lib/css";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
.about-l,.about-r{display:flex;flex-direction:column;justify-content:center;gap:24px;padding-top:80px}
.about-l h2{font-size:clamp(44px,5.6vw,84px)}
.about-l p{font-size:clamp(16px,1.3vw,19px);color:var(--ink-2);max-width:48ch}
.about-l p.lead{color:var(--ink);font-size:clamp(18px,1.6vw,22px);letter-spacing:-.015em;line-height:1.4}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
.facts{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.facts li{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:15px 0;border-bottom:1px solid var(--line);font-size:15px}
.facts span{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);padding-top:3px}
.facts b{font-weight:500;letter-spacing:-.01em;overflow-wrap:anywhere}
.quote{font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.3vw,34px);line-height:1.15;letter-spacing:-.01em;color:var(--ink-2)}
.quote small{display:block;margin-top:12px;font-family:var(--font-mono);font-style:normal;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}

.lan{position:relative;display:flex;justify-content:center;min-height:560px;margin-top:calc(var(--section-y)*-1)}
.swing{position:absolute;top:0;left:50%;width:300px;margin-left:-150px;transform-origin:50% 0;will-change:transform}
.strap{position:relative;margin:0 auto;width:30px;height:calc(var(--section-y) + 70px);background:var(--ink);overflow:hidden;border-radius:0 0 3px 3px}
.strap::before,.strap::after{content:"";position:absolute;top:0;bottom:0;width:2px;background:rgba(255,255,255,.16)}
.strap::before{left:3px}.strap::after{right:3px}
.strap-txt{position:absolute;inset:0;display:flex;justify-content:center;overflow:hidden}
.strap-txt div{writing-mode:vertical-rl;white-space:nowrap;font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.78);animation:strap 14s linear infinite;padding-block:12px}
@keyframes strap{from{transform:translateY(0)}to{transform:translateY(-50%)}}
.strap-wrap{display:flex;flex-direction:column;gap:0}
.clip{position:relative;width:34px;height:38px;margin:-2px auto 0;z-index:2}
.clip i{position:absolute;left:50%;transform:translateX(-50%);background:linear-gradient(90deg,#b9b7b2,#f2f1ee 45%,#9c9a95);border-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,.25)}
.clip i:nth-child(1){top:0;width:30px;height:14px;border-radius:3px 3px 6px 6px}
.clip i:nth-child(2){top:12px;width:12px;height:24px;border-radius:3px 3px 8px 8px}
.idc-hit{position:absolute;inset:0;z-index:5;border-radius:22px;cursor:pointer}
.idc{position:relative;margin:-6px auto 0;width:300px;height:404px;perspective:1200px;border-radius:22px}
.idc-in{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.idc.flip .idc-in{transform:rotateY(180deg)}
@media (hover:hover){.idc:hover .idc-in{transform:rotateY(180deg)}}
.face{position:absolute;inset:0;border-radius:22px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -30px rgba(13,13,13,.35),0 8px 20px -10px rgba(13,13,13,.18);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column}
.face.back{transform:rotateY(180deg);padding:26px 24px}
.band{background:var(--ink);color:#fff;font-family:var(--font-mono);font-size:11px;letter-spacing:.3em;text-align:center;padding:13px 0 12px;position:relative}
.band::before{content:"";position:absolute;left:50%;top:6px;width:42px;height:5px;margin-left:-21px;border-radius:3px;background:rgba(255,255,255,.22)}
.band span{display:block;margin-top:6px}
.ph{position:relative;margin:16px auto 0;width:136px;height:164px;display:grid;place-items:center}
.ph::before{content:"";position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.1),transparent)}
.ph-ring{position:relative;width:128px;height:156px;border-radius:28px;padding:4px;background:linear-gradient(145deg,#d9d7d2,#8f8d88 55%,#e9e6e0)}
.ph-ring div{width:100%;height:100%;border-radius:24px;overflow:hidden;background:#fff}
.ph-ring img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.idc:hover .ph-ring img{transform:scale(1.07)}
.who{text-align:center;margin-top:10px}
.who b{display:block;font-size:20px;letter-spacing:-.03em;line-height:1.1}
.who small{display:block;margin-top:4px;font-size:12px;color:var(--mute)}
.rows{margin:12px 22px 0;display:flex;flex-direction:column;gap:5px}
.rows div{display:flex;justify-content:space-between;gap:10px;font-size:11.5px;border-bottom:1px dashed var(--line);padding-bottom:4px}
.rows dt{font-family:var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mute);font-size:10px;padding-top:1px}
.rows dd{margin:0;font-weight:500;text-align:right}
.foot{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;padding:0 22px 16px}
.bars{display:flex;align-items:flex-end;gap:1.5px;height:30px}
.bars i{display:block;background:var(--ink);width:2px}
.holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(from 20deg,#f4f2ee,#bdbbb6,#6d6b66,#e9e6e0,#9a9893,#f4f2ee);box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);animation:holo 6s linear infinite}
@keyframes holo{to{filter:hue-rotate(0deg);transform:rotate(360deg)}}
.back h3{font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
.back ul{margin:14px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:11px}
.back li{font-size:14px;letter-spacing:-.01em;line-height:1.3;padding-left:16px;position:relative}
.back li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--ink)}
.sig{margin-top:auto;border-top:1px solid var(--line);padding-top:12px}
.sig em{display:block;font-family:var(--font-serif);font-size:25px;line-height:1;color:var(--ink)}
.sig small{display:block;margin-top:8px;font-size:11px;color:var(--mute);overflow-wrap:anywhere}
@media (max-width:1060px){
  .about-grid{grid-template-columns:minmax(0,1fr);gap:48px}
  .about-l,.about-r{padding-top:0}
  .lan{order:-1;margin-top:calc(var(--section-y)*-1);min-height:600px}
  .about-l{padding-top:0}
}
`;

const BARS = [3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2];

export function About() {
  const secRef = useRef<HTMLElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);

  // damped pendulum: pointer velocity -> angle, spring back, idle sway
  useEffect(() => {
    const sec = secRef.current;
    const el = swingRef.current;
    if (!sec || !el || prefersReducedMotion()) return;
    let theta = 0;
    let omega = 0;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      omega += (-0.012 * theta - 0.045 * omega) * dt;
      theta += omega * dt;
      const sway = Math.sin(now / 1500) * 1.4 + Math.sin(now / 2300 + 1) * 0.8;
      el.style.transform = `rotate(${(theta + sway).toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      if (!visible) return;
      omega += Math.max(-28, Math.min(28, e.movementX)) * 0.012;
      omega = Math.max(-1.15, Math.min(1.15, omega));
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(sec);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const onCard = (e: React.MouseEvent | React.KeyboardEvent) => {
    // mouse users flip on hover (CSS); touch + keyboard flip on tap / Enter / Space
    if ("key" in e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      return setFlip((f) => !f);
    }
    if (!window.matchMedia("(hover: hover)").matches || e.detail === 0) setFlip((f) => !f);
  };

  return (
    <section id="about" ref={secRef} className="section" aria-labelledby="about-h">
      <style>{css}</style>
      <div className="wrap">
        <div className="about-grid">
          <div className="about-l">
            <p className="tag rv" style={{ marginBottom: 0 }}>
              <i>01</i> — About
            </p>
            <h2 id="about-h" className="h-display">
              <span className="rv-mask">
                <span>
                  Hi, I&apos;m <em className="accent">{PROFILE.shortName}.</em>
                </span>
              </span>
            </h2>
            <p className="lead rv" style={cv({ "--i": 1 })}>
              {PROFILE.resumeSummary}
            </p>
            <p className="rv" style={cv({ "--i": 2 })}>
              {PROFILE.resumeExtra}
            </p>
            <div className="about-btns rv" style={cv({ "--i": 3 })}>
              <a className="btn btn-primary" href={PROFILE.resume} download>
                Résumé ↓
              </a>
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="lan">
            <div className="swing" ref={swingRef}>
              <div className="strap-wrap">
                <div className="strap" aria-hidden="true">
                  <div className="strap-txt">
                    <div>
                      {Array.from({ length: 2 }, () => `${PROFILE.name} · ${PROFILE.roleShort} · `).join("").repeat(2)}
                    </div>
                  </div>
                </div>
                <div className="clip" aria-hidden="true">
                  <i />
                  <i />
                </div>
              </div>
              <div
                className={`idc${flip ? " flip" : ""}`}
              >
                <button type="button" className="idc-hit" aria-pressed={flip} onClick={onCard} onKeyDown={onCard}>
                  <span className="sr-only">
                    Developer ID card for {PROFILE.name}, {PROFILE.role}. {PROFILE.backLines.join(". ")}. Activate to flip the card.
                  </span>
                </button>
                <div className="idc-in" aria-hidden="true">
                  <div className="face">
                    <div className="band">DEVELOPER ID</div>
                    <div className="ph">
                      <div className="ph-ring">
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                        </div>
                      </div>
                    </div>
                    <div className="who">
                      <b>{PROFILE.name}</b>
                      <small>{PROFILE.role}</small>
                    </div>
                    <dl className="rows">
                      <div>
                        <dt>Dept.</dt>
                        <dd>{PROFILE.dept}</dd>
                      </div>
                      <div>
                        <dt>Based</dt>
                        <dd>{PROFILE.location}</dd>
                      </div>
                      <div>
                        <dt>Class of</dt>
                        <dd>{PROFILE.classOf}</dd>
                      </div>
                    </dl>
                    <div className="foot" aria-hidden="true">
                      <div className="bars">
                        {BARS.map((w, i) => (
                          <i key={i} style={{ width: w, height: i % 5 === 0 ? 30 : 26 }} />
                        ))}
                      </div>
                      <div className="holo" />
                    </div>
                  </div>
                  <div className="face back">
                    <h3>What I am</h3>
                    <ul>
                      {PROFILE.backLines.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                    <div className="sig">
                      <em>{PROFILE.name}</em>
                      <small>If found, say hello · {PROFILE.email}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-r">
            <p className="tag rv" style={{ marginBottom: 0 }}>
              <i>·</i> Quick facts
            </p>
            <ul className="facts rv" style={cv({ "--i": 1 })}>
              <li>
                <span>Location</span>
                <b>{PROFILE.location}</b>
              </li>
              <li>
                <span>Education</span>
                <b>BS Computer Science, SZABIST (2021 – 2025)</b>
              </li>
              <li>
                <span>Currently</span>
                <b>Backend Developer, Alpha Devs (Remote)</b>
              </li>
              <li>
                <span>Email</span>
                <b>
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                </b>
              </li>
            </ul>
            <blockquote className="quote rv" style={cv({ "--i": 2, margin: 0 })}>
              “{PROFILE.quote}”
              <small>— paraphrased from my résumé</small>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
