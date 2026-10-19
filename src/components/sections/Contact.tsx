"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.ct{padding-bottom:clamp(60px,9vh,100px)}
.ct h2{font-size:clamp(44px,8.6vw,136px);font-weight:700;letter-spacing:-.05em;line-height:.96;margin-top:6px}
.ct h2 .w{display:inline-block;white-space:nowrap}
.ch{display:inline-block;cursor:default}
.ch.hop{animation:hop .7s var(--ease)}
@keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}70%{transform:translateY(.02em)}100%{transform:translateY(0)}}
.ct-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:32px;margin-top:clamp(40px,7vh,80px)}
.mail{display:flex;align-items:center;flex-wrap:wrap;gap:14px}
.mail a.big{font-size:clamp(24px,4.4vw,64px);font-weight:600;letter-spacing:-.04em;line-height:1.1;text-decoration:underline;text-decoration-thickness:.06em;text-underline-offset:.14em;text-decoration-color:rgba(13,13,13,.3);transition:text-decoration-color .4s var(--ease);overflow-wrap:anywhere}
.mail a.big:hover{text-decoration-color:var(--ink)}
.copy{height:36px;padding-inline:16px;border-radius:999px;font-size:13px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.copy:hover{background:var(--ink);color:#fff;transform:translateY(-1px)}
.badge{position:relative;width:132px;height:132px;flex:none;display:grid;place-items:center;border-radius:50%}
.badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 22s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.badge span{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:var(--ink);color:#fff;font-size:20px;transition:transform .6s var(--ease)}
.badge:hover span{transform:scale(1.12) rotate(-12deg)}
.links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:clamp(36px,6vh,64px);border-top:1px solid var(--line)}
.links a{display:flex;flex-direction:column;gap:6px;padding:22px 0;border-bottom:1px solid var(--line);transition:padding .5s var(--ease)}
.links a:hover{padding-left:10px}
.links small{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.links b{font-size:clamp(16px,1.6vw,21px);font-weight:600;letter-spacing:-.02em;overflow-wrap:anywhere}
.site-foot{border-top:1px solid var(--line);padding-block:26px}
.site-foot .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;font-size:13px;color:var(--mute)}
.site-foot a:hover{color:var(--ink)}
@media (max-width:700px){.links{grid-template-columns:minmax(0,1fr)}.badge{width:108px;height:108px}}
`;

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi}>
          <span className="w">
          {[...w].map((c, i) => (
            <span key={i} className="ch" aria-hidden="true">
              {c}
            </span>
          ))}
          </span>
          {wi < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const hop = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (!t.classList?.contains("ch") || t.classList.contains("hop")) return;
    t.classList.add("hop");
    t.addEventListener("animationend", () => t.classList.remove("hop"), { once: true });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section id="contact" className="section ct" aria-labelledby="ct-h">
        <style>{css}</style>
        <div className="wrap">
          <p className="tag rv">
            <i>06</i> — Contact
          </p>
          <h2 id="ct-h" aria-label="Let's build something together." onPointerOver={hop}>
            <span className="rv-mask" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
              <span>
                <Letters text="Let’s build" />
              </span>
            </span>
            <span className="rv-mask" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
              <span>
                <em className="accent">
                  <Letters text="something together." />
                </em>
              </span>
            </span>
          </h2>

          <div className="ct-row rv">
            <div className="mail">
              <a className="big" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button className="copy" onClick={copy} type="button">
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <a className="badge" href={`mailto:${PROFILE.email}`} aria-label="Say hello by email">
              <svg viewBox="0 0 132 132" aria-hidden="true">
                <defs>
                  <path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
                </defs>
                <text fontSize="11.5" fontFamily="var(--font-mono)" fill="#0d0d0d">
                  <textPath href="#circ" textLength="322" lengthAdjust="spacing">SAY HELLO · SAY HELLO · SAY HELLO ·</textPath>
                </text>
              </svg>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="links rv">
            <a href={PROFILE.phoneHref}>
              <small>Phone</small>
              <b>{PROFILE.phone}</b>
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              <small>GitHub</small>
              <b>{PROFILE.githubLabel} ↗</b>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              <small>LinkedIn</small>
              <b>{PROFILE.linkedinLabel} ↗</b>
            </a>
          </div>
        </div>
      </section>
      <footer className="site-foot">
        <div className="wrap">
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("top");
            }}
          >
            Back to top ↑
          </a>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}
