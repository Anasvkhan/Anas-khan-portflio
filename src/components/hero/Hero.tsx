"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { cv } from "@/lib/css";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.hero{position:relative;min-height:100svh;padding-top:28px;overflow:clip;display:flex;align-items:center}
.ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);z-index:0;font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(150px,36vw,620px);color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13);pointer-events:none;user-select:none;white-space:nowrap}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:clamp(8px,2vw,32px);width:100%}
.hero-copy{display:flex;flex-direction:column;align-items:flex-start;gap:28px;padding-bottom:6vh}
.hero-copy h1{font-size:clamp(44px,5.2vw,84px)}
.hero-role{font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px}
.vid{position:relative;height:min(96svh,1040px);aspect-ratio:768/960}
.vid video{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;background:transparent;-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent),linear-gradient(180deg,#000 88%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent),linear-gradient(180deg,#000 88%,transparent);mask-composite:intersect}
.snd{position:absolute;left:50%;bottom:3%;transform:translateX(-50%);z-index:3;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease),background .4s}
.snd:hover{transform:translateX(-50%) scale(1.08);background:#2a2a2a}
.snd.ping::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(13,13,13,.35);animation:ping 2s var(--ease) infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(13,13,13,.35)}80%,100%{box-shadow:0 0 0 18px rgba(13,13,13,0)}}
.hero-facts{display:flex;flex-direction:column;gap:18px;align-items:flex-end;text-align:right;padding-bottom:6vh}
.hero-facts dt{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.hero-facts dd{margin:4px 0 0;font-size:15px;font-weight:500;letter-spacing:-.01em;max-width:24ch}
.hero-facts dl{margin:0;display:flex;flex-direction:column;gap:18px}
.hero-scroll{position:absolute;z-index:2;left:var(--gutter);bottom:22px;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
@media (max-width:900px){
  .hero{padding-top:104px;align-items:flex-start}
  .hero-grid{grid-template-columns:minmax(0,1fr);justify-items:center;gap:8px}
  .vid{height:auto;width:min(100%,calc(62svh * .8))}
  .ghost{top:34%;font-size:44vw}
  .hero-copy{align-items:flex-start;padding-bottom:0;width:100%;margin-top:-4vh}
  .hero-copy h1{font-size:clamp(44px,13vw,72px)}
  .hero-facts{display:none}
  .hero-scroll{display:none}
  .hero{padding-bottom:56px}
}
`;

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [audible, setAudible] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const silenced = useRef(false); // visitor explicitly turned the sound off
  const wantPlay = useRef(true);
  const reduce = useRef(false);

  useEffect(() => {
    const v = vidRef.current;
    const hero = heroRef.current;
    if (!v || !hero) return;
    reduce.current = prefersReducedMotion();
    wantPlay.current = !reduce.current;

    if (!reduce.current) {
      v.muted = false;
      v.volume = 1;
      v.play().then(
        () => setAudible(true),
        () => {
          v.muted = true;
          v.play().catch(() => {});
          setBlocked(true);
        },
      );
    }

    const events = ["pointerdown", "keydown", "touchend"] as const;
    const unlock = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.("[data-sound]")) return; // the button handles itself
      cleanup();
      if (silenced.current || reduce.current || !wantPlay.current) return;
      v.muted = false;
      v.play().then(
        () => {
          setAudible(true);
          setBlocked(false);
        },
        () => {
          v.muted = true;
        },
      );
    };
    const cleanup = () => events.forEach((n) => window.removeEventListener(n, unlock, true));
    events.forEach((n) => window.addEventListener(n, unlock, true));

    // The voice only plays while the hero is on screen.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (wantPlay.current && v.paused) v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(hero);
    return () => {
      cleanup();
      io.disconnect();
    };
  }, []);

  const toggle = useCallback(() => {
    const v = vidRef.current;
    if (!v) return;
    if (audible) {
      silenced.current = true;
      v.muted = true;
      if (reduce.current) {
        wantPlay.current = false;
        v.pause();
      }
      setAudible(false);
    } else {
      silenced.current = false;
      wantPlay.current = true;
      v.muted = false;
      v.play().then(
        () => {
          setAudible(true);
          setBlocked(false);
        },
        () => {},
      );
    }
  }, [audible]);

  return (
    <section id="top" ref={heroRef} className="hero" aria-label="Introduction">
      <style>{css}</style>
      <span className="ghost" aria-hidden="true">
        {PROFILE.shortName.toUpperCase()}
      </span>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-role rv" style={cv({ "--i": 0 })}>
            {PROFILE.name} · Node.js
          </p>
          <h1 className="h-display">
            <span className="rv-mask" style={cv({ "--i": 1 })}>
              <span>Backend</span>
            </span>
            <span className="rv-mask" style={cv({ "--i": 2 })}>
              <span>Developer.</span>
            </span>
          </h1>
          <div className="hero-cta rv" style={cv({ "--i": 3 })}>
            <a
              href="#work"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("work");
              }}
            >
              Explore work
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("contact");
              }}
            >
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} download className="btn btn-ghost">
              Résumé ↓
            </a>
          </div>
        </div>

        <div className="vid">
          <video
            ref={vidRef}
            loop
            playsInline
            muted
            preload="auto"
            poster="/hero/poster.webp"
            aria-label={`Short intro video of ${PROFILE.name}`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            data-sound
            className={`snd${blocked && !audible ? " ping" : ""}`}
            onClick={toggle}
            aria-pressed={audible}
            aria-label={audible ? "Turn intro sound off" : "Turn intro sound on"}
          >
            {audible ? (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                <rect x="3" y="2" width="3.5" height="12" rx="1" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                <path d="M4.5 2.4v11.2a.6.6 0 00.9.5l9-5.6a.6.6 0 000-1L5.4 1.9a.6.6 0 00-.9.5z" />
              </svg>
            )}
          </button>
        </div>

        <div className="hero-facts rv" style={cv({ "--i": 4 })}>
          <dl>
            <div>
              <dt>Currently</dt>
              <dd>Backend Developer, Alpha Devs (Remote)</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt>Studied</dt>
              <dd>BS Computer Science, SZABIST</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="hero-scroll" aria-hidden="true">
        Scroll ↓
      </p>
    </section>
  );
}
