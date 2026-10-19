import { cv } from "@/lib/css";

type Props = { n: string; label: string; lines: string[]; accent: string };

/** Mono tag + heading; the last word is an Instrument Serif italic in --mute. */
export function SectionHead({ n, label, lines, accent }: Props) {
  return (
    <div>
      <p className="tag rv" style={cv({ "--i": 0 })}>
        <i>{n}</i> — {label}
      </p>
      <h2 className="h-section">
        {lines.map((l, i) => (
          <span key={l} className="rv-mask" style={cv({ "--i": i + 1 })}>
            <span>
              {l}
              {i === lines.length - 1 && (
                <>
                  {" "}
                  <em className="accent">{accent}</em>
                </>
              )}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
