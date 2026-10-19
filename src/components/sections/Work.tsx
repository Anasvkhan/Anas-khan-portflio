"use client";
import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { cv } from "@/lib/css";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo } from "@/components/ui/TechLogo";

const css = `
.acc{display:flex;gap:12px;height:min(78svh,600px);margin-top:56px}
.pn{position:relative;flex:1 1 0;min-width:0;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.pn.open{flex:8 1 0;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -40px rgba(13,13,13,.3)}
.spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 0;transition:opacity .4s var(--ease),background .4s;text-align:center}
.pn:not(.open) .spine:hover{background:rgba(13,13,13,.025)}
.pn.open .spine{opacity:0;pointer-events:none}
.spine .num{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.spine .vt{writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(16px,1.5vw,20px);font-weight:600;letter-spacing:-.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:70%}
.plus{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);transition:transform .6s var(--ease),background .4s,color .4s}
.spine:hover .plus,.spine:focus-visible .plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.bw{position:absolute;inset:0;width:max(100%,700px)}
.body{height:100%;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:28px;padding:32px;opacity:0;pointer-events:none;transition:opacity .35s var(--ease)}
.pn.open .body{opacity:1;pointer-events:auto;transition:opacity .7s var(--ease) .3s}
.pl{display:flex;flex-direction:column;gap:14px;min-height:0;min-width:0}
.pl .top{display:flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.pl .top b{color:var(--ink);font-weight:500}
.pl h3{font-size:clamp(28px,3.1vw,46px);font-weight:700;letter-spacing:-.045em;line-height:1}
.pl .desc{font-size:14.5px;line-height:1.5;color:var(--ink-2)}
.feat{list-style:none;margin:2px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px}
.feat li{font-size:13px;letter-spacing:-.005em;display:flex;gap:8px;align-items:baseline;line-height:1.3}
.feat li::before{content:"";flex:none;width:5px;height:5px;border-radius:50%;background:var(--ink);transform:translateY(-1px)}
.techs{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
.techs span{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px 0 8px;border-radius:999px;font-size:12px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:var(--card)}
.pr{position:relative;min-height:0;border-radius:20px;background:#f7f6f3;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;clip-path:inset(0 100% 0 0 round 20px);transition:clip-path .5s var(--ease)}
.pn.open .pr{clip-path:inset(0 0 0 0 round 20px);transition:clip-path 1.2s var(--ease) .5s}
.lbl{position:absolute;right:12px;top:12px;z-index:2;font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);background:var(--card);padding:5px 10px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line)}
.ui{position:absolute;inset:0;padding:44px 18px 18px;display:flex;gap:12px;font-size:11px}
.sk{display:block;height:7px;border-radius:4px;background:var(--soft)}
.ui .box{background:var(--card);border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);padding:10px 12px}
.side{width:92px;flex:none;display:flex;flex-direction:column;gap:6px}
.side span{display:block;padding:7px 9px;border-radius:8px;font-size:10.5px;color:var(--mute);white-space:nowrap}
.side span.a{background:var(--ink);color:#fff}
.main{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.seg{display:inline-flex;padding:3px;border-radius:999px;background:var(--soft);align-self:flex-start}
.seg span{padding:4px 10px;border-radius:999px;font-size:10px}
.seg span.a{background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.chart{flex:1;display:flex;align-items:flex-end;gap:8px;padding:10px 12px}
.chart i{flex:1;border-radius:5px 5px 2px 2px;background:var(--soft);height:0;transition:height 1s var(--ease)}
.pn.open .chart i{height:var(--h);transition-delay:calc(.9s + var(--k)*70ms)}
.chart i:nth-child(odd){background:var(--ink)}
.flow{flex:1;display:flex;flex-direction:column;justify-content:center;gap:0;align-items:center}
.flow .node{width:min(78%,260px);display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 12px;border-radius:12px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);font-size:11px;font-weight:500}
.flow .node.d{background:var(--ink);color:#fff}
.flow .node em{font-style:normal;font-family:var(--font-mono);font-size:9px;color:var(--mute)}
.flow .node.d em{color:rgba(255,255,255,.6)}
.flow .link{width:1px;height:14px;background:rgba(13,13,13,.25);position:relative}
.flow .link::after{content:"";position:absolute;left:-2.5px;bottom:-1px;width:6px;height:6px;border-right:1px solid rgba(13,13,13,.4);border-bottom:1px solid rgba(13,13,13,.4);transform:rotate(45deg) scale(.8)}
.wave{display:flex;align-items:center;justify-content:center;gap:3px;height:54px}
.wave i{width:3px;border-radius:2px;background:var(--ink);height:var(--h);animation:eq 1.2s ease-in-out infinite;animation-delay:calc(var(--k)*-90ms)}
@keyframes eq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:8px}
.cal i{aspect-ratio:1;border-radius:5px;background:var(--soft)}
.cal i.a{background:var(--ink)}
@media (max-width:999px){
  .acc{flex-direction:column;height:auto;gap:10px;margin-top:40px}
  .pn,.pn.open{flex:none}
  .spine{position:static;flex-direction:row;gap:16px;padding:20px 22px;text-align:left}
  .pn.open .spine{opacity:1;pointer-events:auto}
  .spine .vt{writing-mode:horizontal-tb;transform:none;flex:1;max-height:none;white-space:normal;font-size:18px}
  .spine .num{width:24px}
  .pn.open .spine .plus{transform:rotate(45deg)}
  .bw{position:static;width:100%;display:grid;grid-template-rows:0fr;transition:grid-template-rows .9s var(--ease)}
  .pn.open .bw{grid-template-rows:1fr}
  .body{min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:20px;padding:0 22px;transition:padding .9s var(--ease),opacity .4s}
  .pn.open .body{padding:4px 22px 24px;transition:padding .9s var(--ease),opacity .7s var(--ease) .2s}
  .pr{height:260px;flex:none}
  .pl h3{display:none}
  .feat{grid-template-columns:1fr 1fr}
}
@media (max-width:420px){.feat{grid-template-columns:1fr}}
`;

function Mini({ kind }: { kind: Project["ui"] }) {
  if (kind === "erp")
    return (
      <div className="ui">
        <div className="side">
          <span className="a">Procurement</span>
          <span>Crew</span>
          <span>Payroll</span>
          <span>Cost reports</span>
        </div>
        <div className="main">
          <div className="seg">
            <span className="a">Fixed Price</span>
            <span>Cost Plus</span>
          </div>
          <div className="box chart" style={{ padding: "10px 12px" }}>
            {[42, 66, 38, 80, 54, 92, 60].map((h, k) => (
              <i key={k} style={cv({ "--h": `${h}%`, "--k": k })} />
            ))}
          </div>
          <div className="box" style={{ display: "grid", gap: 8 }}>
            <span className="sk" style={{ width: "72%" }} />
            <span className="sk" style={{ width: "54%" }} />
          </div>
        </div>
      </div>
    );
  if (kind === "crm")
    return (
      <div className="ui" style={{ justifyContent: "center" }}>
        <div className="flow">
          <div className="node">New lead <em>ingest</em></div>
          <span className="link" />
          <div className="node">n8n webhook <em>auto</em></div>
          <span className="link" />
          <div className="node">BatchData API <em>enrich</em></div>
          <span className="link" />
          <div className="node d">Territory routing <em>atomic</em></div>
          <span className="link" />
          <div className="node">Assigned to role <em>multi-role</em></div>
        </div>
      </div>
    );
  return (
    <div className="ui" style={{ flexDirection: "column" }}>
      <div className="box">
        <div className="wave" aria-hidden="true">
          {[40, 70, 45, 90, 60, 100, 55, 80, 35, 75, 50, 95, 42, 68, 38].map((h, k) => (
            <i key={k} style={cv({ "--h": `${h}%`, "--k": k })} />
          ))}
        </div>
        <span style={{ display: "block", textAlign: "center", color: "var(--mute)", fontSize: 10 }}>Real-time call handling</span>
      </div>
      <div className="box" style={{ flex: 1 }}>
        <span style={{ fontWeight: 500 }}>Appointment scheduling</span>
        <div className="cal" aria-hidden="true">
          {Array.from({ length: 21 }, (_, i) => (
            <i key={i} className={i === 10 ? "a" : ""} />
          ))}
        </div>
      </div>
      <div className="box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Bookings &amp; history</span>
        <span className="sk" style={{ width: 70 }} />
      </div>
    </div>
  );
}

export function Work() {
  const [open, setOpen] = useState(0);
  const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 1000px)").matches;

  return (
    <section id="work" className="section" aria-labelledby="work-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="work-h">
          <SectionHead n="03" label="Selected work" lines={["Things I’ve"]} accent="built." />
        </div>
        <div className="acc rv" style={cv({ "--i": 1 })}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article key={p.id} className={`pn${isOpen ? " open" : ""}`} onMouseEnter={() => canHover() && setOpen(i)}>
                <button
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`pn-${p.id}`}
                  onClick={() => setOpen(isOpen && !canHover() ? -1 : i)}
                  onFocus={() => canHover() && setOpen(i)}
                >
                  <span className="num">{p.index}</span>
                  <span className="vt">{p.title}</span>
                  <span className="plus" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M7 1.5v11M1.5 7h11" />
                    </svg>
                  </span>
                </button>
                <div className="bw" id={`pn-${p.id}`} inert={!isOpen}>
                  <div className="body">
                    <div className="pl">
                      <p className="top">
                        <b>{p.index}</b> <span>{p.kicker}</span> <span>· {p.date}</span>
                      </p>
                      <h3>{p.title}</h3>
                      <p className="desc">{p.description}</p>
                      <ul className="feat">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <div className="techs">
                        {p.tech.map((t) => (
                          <span key={t}>
                            <TechLogo name={t} size={16} />
                            {t}
                          </span>
                        ))}
                      </div>
                      {p.github && (
                        <a className="btn btn-primary" href={p.github} target="_blank" rel="noopener noreferrer">
                          View on GitHub ↗
                        </a>
                      )}
                    </div>
                    <div className="pr" role="img" aria-label={`Illustrative interface sketch for ${p.title}. Not a real screenshot.`}>
                      <span className="lbl">Illustrative UI</span>
                      <Mini kind={p.ui} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
