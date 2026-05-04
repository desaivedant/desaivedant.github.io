# Vedant Desai — Portfolio

A 3D personal portfolio for **Vedant Desai** — Data Engineer becoming AI Engineer.

Built with **React + Vite + TypeScript**, **React Three Fiber** for the 3D scenes, **Tailwind CSS** for styling, and **EmailJS** for the contact form. Designed to deploy to **GitHub Pages** with a fallback config for **Vercel**.

The hero scene is a custom particle system that visualizes the **Medallion architecture** — particles spawn chaotic in the Bronze zone, get pulled into structure in Silver, and emerge as ordered nodes in Gold. Move your cursor to disrupt the flow.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in EmailJS keys (already pre-filled with Vedant's keys)
npm run dev                  # opens http://localhost:5173/portfolio/
```

Build & preview production output:

```bash
npm run build
npm run preview
```

Type-check:

```bash
npm run typecheck
```

---

## Project structure

```
portfolio/
├── public/
│   ├── resume/                      # drop Vedant_Desai_Resume.pdf here
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── og-image.placeholder.txt     # replace with og-image.png (1200x630)
│   └── CNAME.example                # rename to CNAME with custom domain
├── src/
│   ├── components/
│   │   ├── three/                   # all React Three Fiber scenes
│   │   │   ├── MedallionScene.tsx   # hero particle flow
│   │   │   └── SkillGalaxy.tsx      # interactive 3D skill cluster
│   │   ├── sections/                # Hero, About, Skills, Experience, Projects, Roadmap, Contact
│   │   ├── ui/                      # SectionHeader, Tag, …
│   │   └── layout/                  # Nav, Footer, CursorDot
│   ├── data/                        # ← edit content here, not in components
│   │   ├── profile.ts               # name, summary, certs, education
│   │   ├── experience.ts            # work history
│   │   ├── skills.ts                # skill list + categories + proficiency
│   │   ├── projects.ts              # project case studies
│   │   ├── roadmap.ts               # AI learning roadmap
│   │   └── socials.ts               # social links
│   ├── hooks/useTheme.ts
│   ├── lib/utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── .github/workflows/deploy.yml     # GitHub Pages CI
├── vite.config.ts                   # base: '/portfolio/'
├── tailwind.config.ts
└── package.json
```

---

## How to update content

All editable content lives in `src/data/*.ts`. You should rarely need to touch components.

- **New job?** Add an entry to `experience.ts`. Mark `current: true` for the latest, `future: true` for the dashed-amber target role.
- **New project?** Add to `projects.ts`. Set `featured: true` to highlight.
- **Skill leveled up?** Update `proficiency` in `skills.ts` (0–100).
- **AI roadmap progress?** Move items between `done`, `learning`, `next` in `roadmap.ts`.

---

## TODO before going live

- [ ] Drop your resume PDF into `public/resume/Vedant_Desai_Resume.pdf`
- [ ] Generate `public/og-image.png` (1200×630) — see `og-image.placeholder.txt`
- [ ] Set EmailJS env vars in `.env.local` (already pre-filled in `.env.example`)
- [ ] Add the same EmailJS keys as **GitHub Actions secrets** (Settings → Secrets and variables → Actions):
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
- [ ] (Optional) Set up custom domain — see below

---

## Deploy to GitHub Pages

1. Create the repo: `https://github.com/vedantdesai9/portfolio`
2. Push this code:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial portfolio scaffold"
   git remote add origin https://github.com/vedantdesai9/portfolio.git
   git push -u origin main
   ```
3. In GitHub: **Settings → Pages → Source → GitHub Actions**
4. The workflow at `.github/workflows/deploy.yml` runs on every push to `main` and publishes to `https://vedantdesai9.github.io/portfolio/`

---

## Custom domain via GitHub Student Pack (`.me`)

You have free Namecheap `.me` domain credit through the [GitHub Student Developer Pack](https://education.github.com/pack).

1. Go to **education.github.com/pack** → search "Namecheap" → claim your free `.me` domain (e.g. `vedantdesai.me`).
2. In Namecheap: **Domain List → Manage → Advanced DNS** — add these records pointing to GitHub Pages:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  vedantdesai9.github.io.
   ```
3. Rename `public/CNAME.example` → `public/CNAME`, replace its contents with your domain (e.g. `vedantdesai.me`).
4. Commit & push. The workflow will copy `CNAME` into `dist/` automatically.
5. In GitHub: **Settings → Pages → Custom domain** → enter `vedantdesai.me` → enable "Enforce HTTPS".
6. **Important when using a custom domain**, the site is served at `vedantdesai.me/` — *not* `/portfolio/`. Update `vite.config.ts`:
   ```ts
   base: '/',  // was '/portfolio/'
   ```
   And update absolute paths:
   - `src/components/sections/Hero.tsx` → `/portfolio/resume/...` → `/resume/...`
   - `index.html` → `/portfolio/favicon.svg` → `/favicon.svg`
   - `public/sitemap.xml` and `robots.txt` → swap the URL host

---

## Deploy to Vercel (alternative)

Vercel is included in the GitHub Student Pack too.

1. `vercel.json` is already set up.
2. Set `VITE_ROUTER_MODE=browser` in Vercel env vars (uses `BrowserRouter` instead of `HashRouter`).
3. In `vite.config.ts`, change `base: '/portfolio/'` → `base: '/'`.
4. Connect the repo on vercel.com → it builds and deploys automatically.

---

## Performance notes

- 3D scenes are lazy-loaded via `React.Suspense` and code-split via Vite's `manualChunks`
- `prefers-reduced-motion` is respected globally
- Particle counts in `MedallionScene.tsx` and `SkillGalaxy.tsx` are tunable — drop them if you see frame drops on lower-end devices
- A flat-grid fallback for the Skill galaxy is always available via the toggle (and forced on mobile)

---

## Tech

| | |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| 3D | three.js, React Three Fiber, drei |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Forms | react-hook-form + EmailJS |
| Routing | react-router-dom (HashRouter for GH Pages) |
| Icons | lucide-react |
| Hosting | GitHub Pages (Vercel as fallback) |
