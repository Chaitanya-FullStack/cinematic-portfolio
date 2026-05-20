# Vaibhav Khushalani — Portfolio

Animated portfolio built with Next.js 16, GSAP, and shadcn/ui.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Animations:** GSAP 3
- **UI Components:** shadcn/ui (Tailwind v4)
- **Styling:** Tailwind CSS v4 (CSS-first, all tokens in `app/globals.css`)

## Structure

- `app/page.js` — scroll-snap container (100vh per section)
- `components/sections/VideoIntro.jsx` — fullscreen video intro
- `components/sections/HeroSection.jsx` — hero with GSAP stagger animations
- `components/ui/Navbar.jsx` — live IST clock + navigation
- `lib/gsap.js` — GSAP + ScrollTrigger registration
- `app/globals.css` — all CSS tokens (edit here to retheme)

## Assets

Place in `public/assets/`:
- `about-me.mp4` — intro video (autoplays, advances to hero on end)
- `hero.png` — portrait photo (right side of hero section)

## Dev

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Theming

All brand colors live in `:root` in `app/globals.css`. Change `--hero-start`, `--hero-mid`, `--hero-end` to retheme the gradient.
