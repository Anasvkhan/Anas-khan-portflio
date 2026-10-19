"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";
import { PROJECTS, SKILL_GROUPS } from "@/lib/data";
import { cv } from "@/lib/css";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo, brandOf, isBrand } from "@/components/ui/TechLogo";

const css = `
.sk-wrap{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(24px,3vw,48px);margin-top:56px;align-items:start}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.chip{height:36px;padding-inline:16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.chip:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px var(--ink)}
.chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.pt{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.tile{position:relative;aspect-ratio:1/1.08;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:9px 10px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;
  opacity:0;transform:translateY(16px) scale(.94);transition:opacity .7s var(--ease),transform .7s var(--ease),box-shadow .4s var(--ease),background .4s var(--ease);transition-delay:calc((var(--r8) + var(--c8)) * 40ms),calc((var(--r8) + var(--c8)) * 40ms),0s,0s}
.pt.is-in .tile{opacity:1;transform:none}
.pt.is-in .tile.dim{opacity:.2;transform:scale(.97)}
.pt.is-in .tile{transition-delay:calc((var(--r8) + var(--c8)) * 40ms),calc((var(--r8) + var(--c8)) * 40ms),0s,0s}
.pt.is-in[data-settled] .tile{transition-delay:0s}
.tile:hover,.tile:focus-visible,.tile.cur{background:var(--ink);color:#fff;transform:translateY(-3px);box-shadow:0 18px 30px -16px rgba(13,13,13,.5)}
.tile .n{font-family:var(--font-mono);font-size:10px;opacity:.55}
.tile .s{font-size:clamp(20px,2.4vw,32px);font-weight:700;letter-spacing:-.05em;line-height:1}
.tile .nm{font-size:10.5px;line-height:1.15;letter-spacing:-.01em;opacity:.75;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.insp{position:sticky;top:96px;border-radius:28px;min-height:420px;padding:24px;display:flex;flex-direction:column;overflow:hidden}
.insp-logo{position:relative;display:grid;place-items:center;height:190px}
.insp-logo>*{position:relative;z-index:1}
.glow{position:absolute!important;inset:0;z-index:0!important;border-radius:50%;filter:blur(8px);opacity:.9}
.pop{animation:pop .7s var(--ease) both}
@keyframes pop{0%{transform:scale(.6) rotate(-6deg);opacity:0}100%{transform:none;opacity:1}}
.insp h3{font-size:28px;font-weight:700;letter-spacing:-.04em;line-height:1.05;margin-top:12px}
.insp .fam{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-top:8px}
.insp .note{font-size:13px;color:var(--mute);margin-top:6px}
.insp h4{margin:20px 0 8px;font-family:var(--font-mono);font-size:11px;font-weight:400;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.insp ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.insp li{font-size:14px;font-weight:500;letter-spacing:-.01em;display:flex;gap:8px;align-items:center}
.insp li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--ink)}
@media (max-width:1060px){.sk-wrap{grid-template-columns:minmax(0,1fr)}.insp{position:static;order:2;min-height:0}.insp-logo{height:150px}}
@media (max-width:640px){.pt{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.tile{transition-delay:calc((var(--r4) + var(--c4)) * 40ms),calc((var(--r4) + var(--c4)) * 40ms),0s,0s}.pt.is-in .tile{transition-delay:calc((var(--r4) + var(--c4)) * 40ms),calc((var(--r4) + var(--c4)) * 40ms),0s,0s}.tile .s{font-size:24px}}
`;

type Tile = { name: string; sym: string; family: string; note?: string; n: number; uses: string[] };

export function Skills() {
  const tiles = useMemo<Tile[]>(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) =>
      g.skills.map((s) => {
        n += 1;
        const m = (s.match ?? s.name).toLowerCase();
        const uses = PROJECTS.filter((p) => p.tech.some((t) => t.toLowerCase() === m)).map((p) => p.title);
        return { name: s.name, sym: s.sym, family: g.family, note: s.note, n, uses };
      }),
    );
  }, []);
  const families = SKILL_GROUPS.map((g) => g.family);
  const [filter, setFilter] = useState<string | null>(null);
  const [cur, setCur] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const seen = useInView(gridRef, 0.15);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const id = setTimeout(() => setSettled(true), 1800);
    return () => clearTimeout(id);
  }, [seen]);
  const t = tiles[cur];
  const brand = isBrand(t.name) ? brandOf(t.name) : null;

  const pick = (i: number) => {
    if (i === cur) return;
    setCur(i);
    setPopKey((k) => k + 1);
  };

  return (
    <section id="skills" className="section" aria-labelledby="skills-h">
      <style>{css}</style>
      <div className="wrap">
        <div id="skills-h">
          <SectionHead n="02" label="Skills" lines={["The periodic table", "of my"]} accent="stack." />
        </div>
        <div className="sk-wrap">
          <div>
            <div className="chips rv" role="group" aria-label="Filter skills by family">
              <button className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
                All
              </button>
              {families.map((f) => (
                <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(filter === f ? null : f)}>
                  {f}
                </button>
              ))}
            </div>
            <ul ref={gridRef} className="pt rv-wave" data-settled={settled || undefined} style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tiles.map((tl, i) => {
                const dim = filter !== null && tl.family !== filter;
                return (
                  <li
                    key={tl.name}
                    style={{ display: "contents" }}
                  >
                    <button
                      className={`tile${dim ? " dim" : ""}${i === cur ? " cur" : ""}`}
                      style={cv({
                        "--r8": Math.floor(i / 8),
                        "--c8": i % 8,
                        "--r4": Math.floor(i / 4),
                        "--c4": i % 4,
                      })}
                      onMouseEnter={() => pick(i)}
                      onFocus={() => pick(i)}
                      onClick={() => pick(i)}
                    >
                      <span className="n" aria-hidden="true">{String(tl.n).padStart(2, "0")}</span>
                      <span className="s" aria-hidden="true">{tl.sym}</span>
                      <span className="nm">{tl.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="card insp rv" style={cv({ "--i": 1 })} aria-live="polite" aria-label="Skill inspector">
            <div className="insp-logo">
              {brand && (
                <span className="glow" style={{ background: `radial-gradient(closest-side, #${brand.hex}26, transparent)` }} />
              )}
              <span key={popKey} className="pop" style={{ color: "var(--ink)" }}>
                <TechLogo name={t.name} size={150} decorative={false} />
              </span>
            </div>
            <h3>{t.name}</h3>
            <p className="fam">
              {String(t.n).padStart(2, "0")} · {t.sym} · {t.family}
            </p>
            {t.note && <p className="note">{t.note}</p>}
            <h4>Used in</h4>
            {t.uses.length ? (
              <ul>
                {t.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            ) : (
              <p className="note" style={{ margin: 0 }}>
                Listed in my résumé skills.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
