/* Real brand logos (public/logos, simple-icons, CC0) + thin line icons for concepts. */

export const BRAND: Record<string, { file: string; hex: string; title: string }> = {
  javascript: { file: "javascript", hex: "F7DF1E", title: "JavaScript" },
  nodejs: { file: "nodejs", hex: "5FA04E", title: "Node.js" },
  express: { file: "express", hex: "0A0A0A", title: "Express.js" },
  nextjs: { file: "nextjs", hex: "000000", title: "Next.js" },
  flutter: { file: "flutter", hex: "02569B", title: "Flutter" },
  prisma: { file: "prisma", hex: "2D3748", title: "Prisma" },
  jwt: { file: "jwt", hex: "000000", title: "JWT" },
  postgresql: { file: "postgresql", hex: "4169E1", title: "PostgreSQL" },
  mysql: { file: "mysql", hex: "4479A1", title: "MySQL" },
  mongodb: { file: "mongodb", hex: "47A248", title: "MongoDB" },
  supabase: { file: "supabase", hex: "3FCF8E", title: "Supabase" },
  cloudinary: { file: "cloudinary", hex: "3448C5", title: "Cloudinary" },
  n8n: { file: "n8n", hex: "EA4B71", title: "n8n" },
  vercel: { file: "vercel", hex: "000000", title: "Vercel" },
  git: { file: "git", hex: "F03C2E", title: "Git" },
};

const ALIAS: Record<string, string> = {
  "node.js": "nodejs",
  "express.js": "express",
  "next.js": "nextjs",
  "prisma orm": "prisma",
  postgres: "postgresql",
  "batchdata api": "batchdata",
  "restful apis": "api",
  "rest apis": "api",
  "oauth 2.0": "oauth",
  "payment gateway integration": "payment",
  "asynchronous programming": "async",
  "query optimization": "query",
  "aws ses": "ses",
  "vapi ai": "vapi",
  "ci/cd": "cicd",
  "requirement analysis": "requirements",
  "product roadmap": "roadmap",
  microservices: "modules",
  caching: "caching",
};

const key = (name: string) => {
  const k = name.trim().toLowerCase();
  return ALIAS[k] ?? k;
};

export const isBrand = (name: string) => key(name) in BRAND;
export const brandOf = (name: string) => BRAND[key(name)];

const S = (d: string) => <path d={d} />;
export const CONCEPT: Record<string, React.ReactNode> = {
  api: <>{S("M8 5C6 5 6 7 6 9s0 2-2 3c2 1 2 1 2 3s0 4 2 4")}{S("M16 5c2 0 2 2 2 4s0 2 2 3c-2 1-2 1-2 3s0 4-2 4")}</>,
  oauth: <><rect x="5.5" y="11" width="13" height="9" rx="2.2" />{S("M8.5 11V8a3.5 3.5 0 017 0v3")}<circle cx="12" cy="15.5" r="1.2" /></>,
  middleware: <>{S("M12 4 4 8l8 4 8-4-8-4z")}{S("M4 12l8 4 8-4")}{S("M4 16l8 4 8-4")}</>,
  payment: <><rect x="3" y="6" width="18" height="12" rx="2.4" />{S("M3 10h18")}{S("M7 14.5h3")}</>,
  modules: <><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="18" r="2.4" /><circle cx="12" cy="12" r="2" />{S("M8 7.5l2.6 2.8M16 7.5l-2.6 2.8M8 16.5l2.6-2.8M16 16.5l-2.6-2.8")}</>,
  async: <>{S("M20 12a8 8 0 10-2.6 5.9")}{S("M20 4.5v5h-5")}</>,
  caching: <>{S("M13.2 3 5.5 13.2h5.6L10.2 21l8.3-10.4h-5.6z")}</>,
  query: <><circle cx="10.5" cy="10.5" r="6" />{S("M15 15l5.5 5.5")}{S("M8 10.5h5")}</>,
  batchdata: <><ellipse cx="12" cy="6" rx="7" ry="3" />{S("M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6")}{S("M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3")}</>,
  ses: <><rect x="3" y="6" width="18" height="12" rx="2.4" />{S("M3.5 8l8.5 6 8.5-6")}</>,
  vapi: <><rect x="9" y="3" width="6" height="11" rx="3" />{S("M5.5 11a6.5 6.5 0 0013 0")}{S("M12 17.5V21")}</>,
  cicd: <>{S("M4.5 12a7.5 7.5 0 0113-5")}{S("M17.8 3v4.2h-4.2")}{S("M19.5 12a7.5 7.5 0 01-13 5")}{S("M6.2 21v-4.2h4.2")}</>,
  automation: <>{S("M4.5 12a7.5 7.5 0 0113-5")}{S("M17.8 3v4.2h-4.2")}{S("M19.5 12a7.5 7.5 0 01-13 5")}{S("M6.2 21v-4.2h4.2")}<circle cx="12" cy="12" r="1.6" /></>,
  agile: <>{S("M4 12h11")}{S("M11.5 7.5 16 12l-4.5 4.5")}{S("M20 5v14")}</>,
  requirements: <><rect x="5.5" y="4.5" width="13" height="16" rx="2.2" />{S("M9 4.5h6V7H9z")}{S("M9 12h6M9 16h4")}</>,
  roadmap: <><circle cx="5" cy="19" r="1.6" /><circle cx="19" cy="6" r="1.6" />{S("M6.5 18c5-1 2-6 6-6.2 3-.2 2-4 5-5")}</>,
  wireframe: <><rect x="3" y="4" width="18" height="16" rx="2.4" />{S("M3 9h18M9 9v11")}</>,
};
CONCEPT.wireframing = CONCEPT.wireframe;
CONCEPT.middleware = CONCEPT.middleware;

export function TechLogo({
  name,
  size = 24,
  className = "",
  decorative = true,
}: {
  name: string;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const k = key(name);
  const b = BRAND[k];
  if (b)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/logos/${b.file}.svg`} width={size} height={size} loading="lazy" decoding="async" className={className} alt={decorative ? "" : b.title} aria-hidden={decorative || undefined} />;
  const icon = CONCEPT[k] ?? CONCEPT[k.replace(/\s+/g, "")] ?? CONCEPT.modules;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 60 ? 0.9 : 1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : name}
    >
      {icon}
    </svg>
  );
}
