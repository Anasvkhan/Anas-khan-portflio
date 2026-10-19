/**
 * Single source of content. Everything here is taken from the résumé
 * (public/resume/Muhammad_Anas_Khan_CV.pdf). Components only read from this file.
 *
 * Sections the résumé has no data for (Certifications, coding-platform Achievements,
 * project repo links, CGPA) are intentionally absent.
 */

export const PROFILE = {
  name: "Muhammad Anas Khan",
  shortName: "Anas",
  initials: "MA",
  role: "Backend Developer (Node.js)",
  roleShort: "Backend Developer",
  email: "ak1096561@gmail.com",
  phone: "+92-312-8694139",
  phoneHref: "tel:+923128694139",
  location: "Karachi, Pakistan",
  github: "https://github.com/Anasvkhan",
  githubLabel: "github.com/Anasvkhan",
  linkedin: "https://www.linkedin.com/in/anas-khan",
  linkedinLabel: "linkedin.com/in/anas-khan",
  resume: "/resume/Muhammad_Anas_Khan_CV.pdf",
  resumeSummary:
    "Backend Developer with 2+ years of professional experience building production REST APIs and web platforms in Node.js, Express.js, and JavaScript, with measurable gains in API speed and efficiency.",
  resumeExtra:
    "BS in Computer Science (SZABIST, 2025); built an AI voice agent, a multi-role CRM, and a 7-module ERP for US and UK clients.",
  quote: "Production APIs and web platforms, built for speed and efficiency.",
  classOf: "2025",
  dept: "Computer Science",
  backLines: [
    "Backend Developer (Node.js)",
    "BS Computer Science, SZABIST 2025",
    "2+ years building production REST APIs",
    "AI voice agent · multi-role CRM · 7-module ERP",
    "Remote Backend Developer at Alpha Devs",
  ],
} as const;

export type NavItem = { id: string; label: string };
export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Contact" },
];

export type Skill = { name: string; sym: string; match?: string; note?: string };
export type SkillGroup = { id: string; label: string; family: string; skills: Skill[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    label: "Programming Languages",
    family: "Languages",
    skills: [
      { name: "JavaScript", sym: "Js" },
      { name: "Node.js", sym: "Nd" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Frameworks",
    family: "Backend",
    skills: [
      { name: "Express.js", sym: "Ex" },
      { name: "Next.js", sym: "Nx" },
      { name: "Flutter", sym: "Fl" },
      { name: "Prisma ORM", sym: "Pr", match: "Prisma" },
    ],
  },
  {
    id: "apis",
    label: "APIs & Security",
    family: "APIs & Security",
    skills: [
      { name: "RESTful APIs", sym: "Re" },
      { name: "JWT", sym: "Jw" },
      { name: "OAuth 2.0", sym: "Oa" },
      { name: "Middleware", sym: "Mw" },
      { name: "Payment gateway integration", sym: "Pg" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    family: "Architecture",
    skills: [
      { name: "Microservices", sym: "Ms" },
      { name: "Asynchronous programming", sym: "As", note: "async/await, Promises" },
      { name: "Caching", sym: "Ca" },
      { name: "Query optimization", sym: "Qo" },
    ],
  },
  {
    id: "databases",
    label: "Databases & Storage",
    family: "Databases",
    skills: [
      { name: "PostgreSQL", sym: "Pq" },
      { name: "MySQL", sym: "My" },
      { name: "MongoDB", sym: "Mo" },
      { name: "Supabase", sym: "Sb" },
      { name: "Cloudinary", sym: "Cl" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations & Automation",
    family: "Integrations",
    skills: [
      { name: "n8n", sym: "N8" },
      { name: "BatchData API", sym: "Bd", match: "BatchData" },
      { name: "AWS SES", sym: "Ss" },
      { name: "Vapi AI", sym: "Va" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    family: "DevOps & Tools",
    skills: [
      { name: "Vercel", sym: "Ve" },
      { name: "CI/CD", sym: "Ci" },
      { name: "Git", sym: "Gi" },
    ],
  },
  {
    id: "methods",
    label: "Methodologies",
    family: "Methodologies",
    skills: [
      { name: "Agile", sym: "Ag" },
      { name: "Requirement Analysis", sym: "Ra" },
      { name: "Product Roadmap", sym: "Rm" },
      { name: "Wireframing", sym: "Wf" },
    ],
  },
];

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  date: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  ui: "erp" | "crm" | "voice";
};

export const PROJECTS: Project[] = [
  {
    id: "erp",
    index: "01",
    title: "Film & TV Set Construction ERP",
    kicker: "ERP · UK client",
    date: "June 2026",
    description:
      "Built a custom 7-module ERP for a UK film and TV set construction firm, unifying procurement, crew management, payroll, and live cost reporting; automated BECTU-compliant payroll and Fixed Price vs. Cost Plus profit tracking, with AWS SES email triggers and Cloudinary document validation enforced at the database layer.",
    features: [
      "7 modules in one ERP",
      "Procurement and crew management",
      "BECTU-compliant payroll",
      "Live cost reporting",
      "Fixed Price vs. Cost Plus tracking",
      "AWS SES email triggers",
      "Cloudinary document validation",
      "Enforced at the database layer",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "AWS SES", "Cloudinary"],
    ui: "erp",
  },
  {
    id: "crm",
    index: "02",
    title: "PFC CRM",
    kicker: "Real estate CRM · US client",
    date: "May 2026",
    description:
      "Engineered a multi-role real estate CRM for a US-based operation, replacing spreadsheet workflows with automated lead ingestion and territory routing via n8n webhooks and the BatchData API, using atomic database operations to prevent assignment race conditions.",
    features: [
      "Multi-role access",
      "Replaces spreadsheet workflows",
      "Automated lead ingestion",
      "Territory routing",
      "n8n webhooks",
      "BatchData API",
      "Atomic database operations",
      "No assignment race conditions",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Supabase", "BatchData", "n8n"],
    ui: "crm",
  },
  {
    id: "voice",
    index: "03",
    title: "AI Dental Receptionist Voice Agent",
    kicker: "AI voice agent",
    date: "June 2025",
    description:
      "Developed an AI voice agent that automates patient inquiries, appointment scheduling, and call handling in real time, integrating Vapi AI with a Node.js backend and storing bookings and interaction history in PostgreSQL via Prisma.",
    features: [
      "Patient inquiries",
      "Appointment scheduling",
      "Real-time call handling",
      "Vapi AI integration",
      "Node.js backend",
      "Bookings stored in PostgreSQL",
      "Interaction history",
      "Prisma data layer",
    ],
    tech: ["Node.js", "Vapi AI", "PostgreSQL", "Prisma"],
    ui: "voice",
  },
];

export type TimelineEntry = {
  kind: "Education" | "Experience";
  period: string;
  start: number;
  title: string;
  place: string;
  detail: string;
};

export const EDUCATION: TimelineEntry[] = [
  {
    kind: "Education",
    period: "2017 – 2019",
    start: 2017,
    title: "High School / A-Levels",
    place: "Beaconhouse School System",
    detail: "High School / A-Levels.",
  },
  {
    kind: "Education",
    period: "2021 – 2025",
    start: 2021,
    title: "BS in Computer Science",
    place: "Shaheed Zulfiqar Ali Bhutto Institute of Science and Technology",
    detail: "Bachelor of Science in Computer Science.",
  },
];

export const EXPERIENCE: TimelineEntry[] = [
  {
    kind: "Experience",
    period: "July 2024",
    start: 2024.5,
    title: "Mobile Developer Intern",
    place: "Technosys – Karachi, Pakistan",
    detail:
      "Built an HR management app for recruitment workflows covering job postings and applicant tracking; automated repetitive HR workflows, reducing manual workload by 70%.",
  },
  {
    kind: "Experience",
    period: "Nov 2025 – Apr 2026",
    start: 2025.9,
    title: "Backend Engineer",
    place: "Zyne Ventures – Karachi, Pakistan",
    detail:
      "Full-stack web and mobile products with Node.js, Flutter and PostgreSQL. Cut server response time by 40% and network load by 30%, and optimized PostgreSQL with indexing.",
  },
  {
    kind: "Experience",
    period: "May 2026 – present",
    start: 2026.4,
    title: "Backend Developer",
    place: "Alpha Devs – Karachi, Pakistan (Remote)",
    detail:
      "Building and maintaining Node.js APIs and payment-enabled services; improved request handling efficiency by 35%, with JWT auth, Vercel deployments and CI/CD.",
  },
];

export const TIMELINE: TimelineEntry[] = [...EDUCATION, ...EXPERIENCE].sort((a, b) => a.start - b.start);

export type Achievement = {
  value: number;
  suffix: string;
  label: string;
  caption: string;
  detail: string;
  icon: string;
};

/** Measurable results stated in the résumé. */
export const ACHIEVEMENTS: Achievement[] = [
  {
    value: 2,
    suffix: "+",
    label: "Years professional",
    caption: "Building production REST APIs and web platforms.",
    detail: "Node.js · Express.js · JavaScript",
    icon: "nodejs",
  },
  {
    value: 35,
    suffix: "%",
    label: "Request efficiency",
    caption: "Improved request handling with RESTful APIs.",
    detail: "Alpha Devs · May 2026 – present",
    icon: "express",
  },
  {
    value: 40,
    suffix: "%",
    label: "Faster responses",
    caption: "Server response time via async/await and Promises.",
    detail: "Zyne Ventures · Nov 2025 – Apr 2026",
    icon: "async",
  },
  {
    value: 30,
    suffix: "%",
    label: "Less network load",
    caption: "Optimized query handling and caching.",
    detail: "Zyne Ventures · Nov 2025 – Apr 2026",
    icon: "caching",
  },
  {
    value: 70,
    suffix: "%",
    label: "Less manual work",
    caption: "Automated repetitive HR workflows.",
    detail: "Technosys · July 2024",
    icon: "automation",
  },
  {
    value: 7,
    suffix: "",
    label: "ERP modules",
    caption: "Custom ERP for a UK film and TV set construction firm.",
    detail: "Film & TV Set Construction ERP · June 2026",
    icon: "modules",
  },
];
