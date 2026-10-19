# Muhammad Anas Khan — Portfolio

A quiet, light, single-page portfolio. Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis.
No WebGL, no GSAP, no loader, no runtime third-party requests. First-load JS ≈ 129 kB.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Content

Everything on the page comes from the résumé and lives in **`src/lib/data.ts`** (`PROFILE`, `NAV`, `SKILL_GROUPS`,
`PROJECTS`, `EDUCATION`, `EXPERIENCE`, `ACHIEVEMENTS`). Components only read from it. The résumé PDF is served from
`public/resume/Muhammad_Anas_Khan_CV.pdf`.

The résumé has no certifications, coding-platform ranks, CGPA or project repo links, so those sections/buttons are
omitted rather than invented. Add data (and a component) if that changes; `PROJECTS[n].github` already renders a
"View on GitHub ↗" button when set.

## Sections

| # | Section    | Component                      | Motion |
|---|------------|--------------------------------|--------|
| – | Hero       | `hero/Hero.tsx`                | Looping intro video (mix-blend multiply), pauses below 35 % visibility, sound toggle |
| 01 | About     | `sections/About.tsx`           | Hanging lanyard ID card: damped pendulum, idle sway, 3D flip (hover / tap / Enter·Space) |
| 02 | Skills    | `sections/Skills.tsx`          | "Periodic table" tiles, diagonal wave reveal, family filter, sticky inspector |
| 03 | Work      | `sections/Work.tsx`            | Expanding accordion gallery, CSS-only illustrative UIs |
| 04 | Experience| `sections/Experience.tsx`      | Education + work as one path; spine draws with scroll |
| 05 | Impact    | `sections/Impact.tsx`          | Pinned horizontal gallery, count-up numbers (the résumé's measurable results) |
| 06 | Contact   | `sections/Contact.tsx`         | Letter-hop heading, copy-email chip, spinning badge, footer |

Nav: About · Skills · Work · Experience · Impact · Contact. Shared: `Navigation.tsx`, `ui/RevealObserver.tsx`
(`.rv`, `.rv-mask`, `.rv-wave` → `.is-in`), `ui/TechLogo.tsx` (`BRAND`, `CONCEPT`, `isBrand()`), `lib/scroll.tsx` (Lenis).
`prefers-reduced-motion` disables smooth scroll, the hero autoplay and decorative motion.

## Rebuilding the hero video

```bash
pip install numpy pillow imageio-ffmpeg      # or have ffmpeg on PATH
python3 scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop W:H:X:Y  --loop-seconds 10  --still-at 2.0
```

It crops tightly around the person (auto-detected, centred, 4:5), scales to 768 px wide, whitens the backdrop
(`colorlevels`), makes a seamless loop (0.5 s `xfade` on the picture and a sample-accurate equal-power cross-fade on the
audio in numpy; nothing is retimed, so lips stay in sync) and writes `public/hero/hero.mp4` (H.264 + AAC),
`hero.webm` (VP9 + Opus), `hero/poster.webp`, `public/portrait-bust.webp` (480×600) and `public/og.jpg` (1200×630).

## Credits & licences

- Brand logos in `public/logos/` are from [Simple Icons](https://simpleicons.org) (CC0 1.0, see
  `public/logos/LICENSE-simple-icons.md`), coloured with each brand's official hex. Logos are trademarks of their
  respective owners. Concept icons are custom line icons.
- Fonts (self-hosted in `src/fonts`, SIL OFL 1.1): Inter Tight, Instrument Serif, JetBrains Mono — via Fontsource.
