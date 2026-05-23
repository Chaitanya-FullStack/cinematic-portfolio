# Responsive + Typography + SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make portfolio fully responsive on mobile/tablet, lift body text to About-section readability standard, and add complete SEO metadata, sitemap, and robots.txt.

**Architecture:** Desktop-first CSS gets `@media (max-width: 767px)` and `(768–1023px)` additions. Typography uses two new CSS custom properties (`--text-body`, `--text-small`) defined once in `globals.css` and referenced across section CSS modules. SEO lives entirely in `app/layout.js` + two new files. No component restructuring.

**Tech Stack:** Next.js 15 App Router, CSS Modules, react-icons/fa, GSAP

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/globals.css` | Modify | Add `--text-body` + `--text-small` tokens |
| `styles/sections/ProjectsSection.module.css` | Modify | Font size updates + mobile desc fix |
| `styles/sections/WorkExperienceSection.module.css` | Modify | Font size updates + mobile bullet fix |
| `styles/sections/PublicationsSection.module.css` | Modify | Font size updates + mobile desc fix |
| `styles/sections/FooterSection.module.css` | Modify | Font size updates |
| `components/ui/Navbar.jsx` | Modify | Add `isOpen` hamburger state + mobile menu JSX |
| `styles/ui/Navbar.module.css` | Modify | Hamburger + mobile overlay styles |
| `app/layout.js` | Modify | Full `metadata` export + JSON-LD `<script>` |
| `app/sitemap.js` | Create | Next.js dynamic sitemap → `/sitemap.xml` |
| `public/robots.txt` | Create | Allow all + sitemap pointer |

---

## Task 1: CSS Typography Tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add tokens inside `:root`**

Open `app/globals.css`. Inside the existing `:root {}` block, after the `--hero-name-size` line, add:

```css
/* Readable body text — matches About section scale */
--text-body:  clamp(0.9rem, 1.2vw, 1.05rem);
--text-small: 0.72rem;
```

- [ ] **Step 2: Verify dev server reflects the variables**

Run: `npm run dev`  
Open browser DevTools → Elements → `<html>` → Computed. Confirm `--text-body` is listed. No visual change expected yet.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add --text-body and --text-small CSS tokens"
```

---

## Task 2: Projects Section Typography

**Files:**
- Modify: `styles/sections/ProjectsSection.module.css`

- [ ] **Step 1: Update `.desc` font size**

Replace:
```css
.desc {
  font-size: clamp(0.65rem, 0.95vw, 0.74rem);
```
With:
```css
.desc {
  font-size: var(--text-body);
```

- [ ] **Step 2: Update `.subtitle` font size**

Replace:
```css
.subtitle {
  font-size: clamp(0.65rem, 1vw, 0.82rem);
```
With:
```css
.subtitle {
  font-size: var(--text-small);
```

- [ ] **Step 3: Update `.typeTag` font size**

Replace:
```css
.typeTag {
  font-size: 0.52rem;
```
With:
```css
.typeTag {
  font-size: var(--text-small);
```

- [ ] **Step 4: Update `.tag` font size**

Replace:
```css
.tag {
  font-size: 0.52rem;
```
With:
```css
.tag {
  font-size: var(--text-small);
```

- [ ] **Step 5: Fix mobile landscape `.desc`**

Inside `@media (min-width: 480px) and (max-width: 767px)` block, add after the existing rules:
```css
  .desc { font-size: 0.88rem; }
```

- [ ] **Step 6: Visual check**

Navigate to Projects section in browser. Description text should be noticeably larger. On mobile viewport (DevTools → 375px wide), landscape (480px) shows description.

- [ ] **Step 7: Commit**

```bash
git add styles/sections/ProjectsSection.module.css
git commit -m "style: lift Projects section text to --text-body scale"
```

---

## Task 3: Work Experience Section Typography

**Files:**
- Modify: `styles/sections/WorkExperienceSection.module.css`

- [ ] **Step 1: Update `.bullet` font size**

Replace:
```css
.bullet {
  font-size: clamp(0.56rem, 0.8vw, 0.64rem);
```
With:
```css
.bullet {
  font-size: var(--text-body);
```

- [ ] **Step 2: Update `.role` font size**

Replace:
```css
.role {
  font-size: clamp(0.58rem, 0.85vw, 0.72rem);
```
With:
```css
.role {
  font-size: var(--text-small);
```

- [ ] **Step 3: Update `.period` font size**

Replace:
```css
.period {
  font-size: 0.62rem;
```
With:
```css
.period {
  font-size: var(--text-small);
```

- [ ] **Step 4: Update `.typeTag` font size**

Replace:
```css
.typeTag {
  font-size: 0.46rem;
```
With:
```css
.typeTag {
  font-size: var(--text-small);
```

- [ ] **Step 5: Update `.location` font size**

Replace:
```css
.location {
  font-size: 0.52rem;
```
With:
```css
.location {
  font-size: var(--text-small);
```

- [ ] **Step 6: Update `.tag` font size**

Replace:
```css
.tag {
  font-size: 0.48rem;
```
With:
```css
.tag {
  font-size: var(--text-small);
```

- [ ] **Step 7: Update `.label` and `.labelRight` font sizes**

Replace:
```css
.label {
  font-size: 0.58rem;
```
With:
```css
.label {
  font-size: var(--text-small);
```

Replace:
```css
.labelRight {
  font-size: 0.58rem;
```
With:
```css
.labelRight {
  font-size: var(--text-small);
```

- [ ] **Step 8: Fix mobile bullet size**

Inside `@media (max-width: 767px)` block, replace:
```css
  .bullet   { font-size: 0.6rem; -webkit-line-clamp: 3; }
```
With:
```css
  .bullet   { font-size: 0.88rem; -webkit-line-clamp: 3; }
```

- [ ] **Step 9: Visual check**

Navigate to Work Experience. Bullet points should be clearly readable. On 375px viewport, bullets should be visibly larger than before.

- [ ] **Step 10: Commit**

```bash
git add styles/sections/WorkExperienceSection.module.css
git commit -m "style: lift Work Experience text to --text-body scale"
```

---

## Task 4: Publications Section Typography

**Files:**
- Modify: `styles/sections/PublicationsSection.module.css`

- [ ] **Step 1: Update `.desc` font size**

Replace:
```css
.desc {
  font-size: clamp(0.58rem, 0.85vw, 0.68rem);
```
With:
```css
.desc {
  font-size: var(--text-body);
```

- [ ] **Step 2: Update `.platform` font size**

Replace:
```css
.platform {
  font-size: 0.46rem;
```
With:
```css
.platform {
  font-size: var(--text-small);
```

- [ ] **Step 3: Update `.year` font size**

Replace:
```css
.year {
  font-size: 0.65rem;
```
With:
```css
.year {
  font-size: var(--text-small);
```

- [ ] **Step 4: Update `.label` font size**

Replace:
```css
.label {
  font-size: 0.58rem;
```
With:
```css
.label {
  font-size: var(--text-small);
```

- [ ] **Step 5: Fix mobile desc size**

Inside `@media (max-width: 767px)` block, replace:
```css
  .desc        { font-size: 0.6rem; -webkit-line-clamp: 2; }
```
With:
```css
  .desc        { font-size: 0.88rem; -webkit-line-clamp: 2; }
```

- [ ] **Step 6: Visual check**

Navigate to Publications. Article descriptions should be clearly readable at desktop and mobile.

- [ ] **Step 7: Commit**

```bash
git add styles/sections/PublicationsSection.module.css
git commit -m "style: lift Publications text to --text-body scale"
```

---

## Task 5: Footer Section Typography

**Files:**
- Modify: `styles/sections/FooterSection.module.css`

- [ ] **Step 1: Update `.footerDescription` font size**

Replace:
```css
.footerDescription {
  max-width: 280px;
  font-size: 0.76rem;
```
With:
```css
.footerDescription {
  max-width: 280px;
  font-size: var(--text-body);
```

- [ ] **Step 2: Update `.greetLine` font size**

Replace:
```css
.greetLine {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.55rem;
```
With:
```css
.greetLine {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-small);
```

- [ ] **Step 3: Update `.roleLabel` font size**

Replace:
```css
.roleLabel {
  font-size: 0.55rem;
```
With:
```css
.roleLabel {
  font-size: var(--text-small);
```

- [ ] **Step 4: Update `.ctaEyebrow` font size**

Replace:
```css
.ctaEyebrow {
  font-size: 0.55rem;
```
With:
```css
.ctaEyebrow {
  font-size: var(--text-small);
```

- [ ] **Step 5: Update `.copy` and `.copyAll` font sizes**

Replace:
```css
.copy {
  font-size: 0.58rem;
```
With:
```css
.copy {
  font-size: var(--text-small);
```

Replace:
```css
.copyAll {
  font-size: 0.52rem;
```
With:
```css
.copyAll {
  font-size: var(--text-small);
```

- [ ] **Step 6: Update `.builtWith` font size**

Replace:
```css
.builtWith {
  font-size: 0.52rem;
```
With:
```css
.builtWith {
  font-size: var(--text-small);
```

- [ ] **Step 7: Visual check**

Navigate to Footer (last section). Description text under the name should be clearly readable. Bottom bar copyright text should be crisp.

- [ ] **Step 8: Commit**

```bash
git add styles/sections/FooterSection.module.css
git commit -m "style: lift Footer text to --text-body/small scale"
```

---

## Task 6: Navbar Mobile Hamburger Menu

**Files:**
- Modify: `components/ui/Navbar.jsx`
- Modify: `styles/ui/Navbar.module.css`

- [ ] **Step 1: Add FaBars + FaTimes import to Navbar.jsx**

The file already imports from react-icons isn't present — add at top:
```js
import { FaBars, FaTimes } from 'react-icons/fa'
```

Add after existing imports (after `import styles from ...`).

- [ ] **Step 2: Add `menuOpen` state**

Inside `export default function Navbar()`, after the existing state declarations (`time`, `onIntro`, `onDark`), add:
```js
const [menuOpen, setMenuOpen] = useState(false)
```

- [ ] **Step 3: Add hamburger button + mobile overlay to JSX**

The `return` must become a fragment so the mobile menu can live outside `<header>` (avoids z-index stacking context issues — header is z-index 100, menu is z-index 50, so header always renders above the overlay).

Replace the entire `return (...)` block with:
```jsx
  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${onIntro ? styles.introMode : ''} ${onDark ? styles.darkMode : ''}`}>
        <span className={styles.time}>INDIA TIME - {time}</span>

        <NavigationMenu className={styles.navMenu}>
          <NavigationMenuList className="flex gap-6">
            {NAV_ITEMS.map(({ label, idx }) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  className={styles.navLink}
                  onClick={() => {
                    const scroller = document.querySelector('main')
                    if (scroller) gsap.to(scroller, {
                      scrollTop: idx * window.innerHeight,
                      duration: 1.0,
                      ease: 'power3.inOut',
                    })
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <a
          href={`mailto:${profile.email}`}
          className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8`}
        >
          Email me
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(({ label, idx }) => (
            <button
              key={label}
              className={styles.mobileNavLink}
              onClick={() => {
                const scroller = document.querySelector('main')
                if (scroller) gsap.to(scroller, {
                  scrollTop: idx * window.innerHeight,
                  duration: 1.0,
                  ease: 'power3.inOut',
                })
                setMenuOpen(false)
              }}
            >
              {label}
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            {profile.email}
          </a>
        </div>
      )}
    </>
  )
```

- [ ] **Step 4: Add CSS for hamburger + mobile overlay**

Open `styles/ui/Navbar.module.css`. After the existing `@media (max-width: 767px)` block, append:

```css
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--navbar-text);
  padding: 0.25rem;
  align-items: center;
  justify-content: center;
}

@media (max-width: 767px) {
  .hamburger { display: flex; }
  .emailBtn  { display: none; }
}

.mobileMenu {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.97);
  z-index: 50; /* below header z-index:100 so hamburger stays visible */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.2rem;
}

.mobileNavLink {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s;
  font-family: var(--font-geist-sans);
}

.mobileNavLink:hover {
  color: var(--accent);
}

.mobileMailLink {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  margin-top: 1rem;
  letter-spacing: 0.06em;
  transition: color 0.2s;
}

.mobileMailLink:hover {
  color: var(--accent);
}
```

- [ ] **Step 5: Visual check on mobile**

Set DevTools to 375px width. Navbar should show only the hamburger icon (time + nav links hidden). Tap hamburger → full-screen dark overlay with nav items appears. Tap any item → scrolls to section and closes menu.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Navbar.jsx styles/ui/Navbar.module.css
git commit -m "feat: add mobile hamburger menu to Navbar"
```

---

## Task 7: SEO — layout.js Metadata + JSON-LD

**Files:**
- Modify: `app/layout.js`

- [ ] **Step 1: Replace `metadata` export**

Replace the existing `export const metadata = { ... }` block with:

```js
export const metadata = {
  metadataBase: new URL('https://vaibhavkhushalani.dev'),
  title: {
    default: 'Vaibhav Khushalani — Full Stack Developer',
    template: '%s | Vaibhav Khushalani',
  },
  description:
    'Full Stack Engineer with 4+ years building scalable web and AI-powered systems using MERN, Next.js, and Python. Available worldwide for collaborations.',
  keywords: [
    'Vaibhav Khushalani',
    'Full Stack Developer',
    'Software Engineer',
    'MERN Stack',
    'Next.js Developer',
    'React Developer',
    'Node.js',
    'AI Systems',
    'Portfolio',
    'India',
  ],
  authors: [{ name: 'Vaibhav Khushalani', url: 'https://vaibhavkhushalani.dev' }],
  creator: 'Vaibhav Khushalani',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vaibhavkhushalani.dev',
    siteName: 'Vaibhav Khushalani',
    title: 'Vaibhav Khushalani — Full Stack Developer',
    description:
      'Full Stack Engineer with 4+ years building scalable web and AI-powered systems using MERN, Next.js, and Python. Available worldwide for collaborations.',
    images: [
      {
        url: '/assets/hero.png',
        width: 1200,
        height: 630,
        alt: 'Vaibhav Khushalani — Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Khushalani — Full Stack Developer',
    description:
      'Full Stack Engineer with 4+ years building scalable web and AI-powered systems using MERN, Next.js, and Python. Available worldwide for collaborations.',
    images: ['/assets/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://vaibhavkhushalani.dev',
  },
}
```

- [ ] **Step 2: Add JSON-LD script to layout body**

Inside `RootLayout`, add a `<script>` tag in the `<body>` before `<Cursor />`:

```jsx
<body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} ${dancing.variable} h-full antialiased`}>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Vaibhav Khushalani',
        url: 'https://vaibhavkhushalani.dev',
        email: 'vaibhavkhush124@gmail.com',
        jobTitle: 'Full Stack Developer',
        sameAs: [
          'https://github.com/VaibhavKhushalani',
          'https://www.linkedin.com/in/vaibhav-khushalani-760217136',
          'https://medium.com/@vaibhavkhushalani',
          'https://www.instagram.com/vaibhav.create',
          'https://www.youtube.com/@vaibhav.create',
        ],
      }),
    }}
  />
  <Cursor />
  {children}
</body>
```

- [ ] **Step 3: Verify metadata in browser**

Run dev server. Open browser → View Source. Confirm:
- `<title>Vaibhav Khushalani — Full Stack Developer</title>` present
- `<meta name="description" ...>` present
- `<meta property="og:title" ...>` present
- `<script type="application/ld+json">` present with Person schema

- [ ] **Step 4: Commit**

```bash
git add app/layout.js
git commit -m "seo: add full metadata, OG tags, Twitter card, JSON-LD"
```

---

## Task 8: SEO — Sitemap

**Files:**
- Create: `app/sitemap.js`

- [ ] **Step 1: Create sitemap file**

Create `app/sitemap.js` with this content:

```js
export default function sitemap() {
  return [
    {
      url: 'https://vaibhavkhushalani.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

- [ ] **Step 2: Verify sitemap route**

With dev server running, open `http://localhost:3000/sitemap.xml`. Should return valid XML with the URL entry.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.js
git commit -m "seo: add dynamic sitemap via app/sitemap.js"
```

---

## Task 9: SEO — robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

Create `public/robots.txt` with this exact content:

```
User-agent: *
Allow: /

Sitemap: https://vaibhavkhushalani.dev/sitemap.xml
```

- [ ] **Step 2: Verify robots.txt route**

With dev server running, open `http://localhost:3000/robots.txt`. Should return the text above.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "seo: add robots.txt"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full mobile walkthrough**

Set DevTools to iPhone SE (375×667). Scroll through every section:
- Navbar: shows hamburger, menu overlay works
- Hero: name readable, layout intact
- About: already responsive (reference)
- Projects: description visible on landscape, single column on portrait
- Work Experience: bullets readable at 0.88rem, vertical stack layout
- Publications: descriptions readable, itemRight hidden
- Footer: columns stack, bottom bar shows monogram + copyright

- [ ] **Step 2: Full tablet walkthrough**

Set DevTools to iPad (768×1024). Confirm no layout overflow in any section.

- [ ] **Step 3: Typography sanity check**

On desktop (1440px): description text across all sections should feel comparable to About section's bio density — not identical size, but same readability tier.

- [ ] **Step 4: SEO audit**

Use browser DevTools → Lighthouse → SEO audit. Target score 90+. If lower, check missing meta tags in the report.

- [ ] **Step 5: Final commit if clean**

```bash
git add -A
git status  # confirm only expected files
git commit -m "chore: final responsive + SEO verification pass"
```
