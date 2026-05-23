# Screen Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark liquid-glass fullscreen intro overlay with a START button that shatters the screen on click, reveals the portfolio, and unmutes the VideoIntro video.

**Architecture:** `ScreenLoader` is a self-contained component mounted above `<Navbar>` in `page.js`. On click it fires `loader-dismissed` window event immediately (Safari audio gesture), then runs a GSAP crack+shatter animation, then calls `onDismiss()` to unmount itself. `VideoIntro` adds a one-time listener for `loader-dismissed` and unmutes its video ref.

**Tech Stack:** GSAP (already loaded), SVG for cracks, inline DOM manipulation for shards, CSS backdrop-filter for glass effect.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/sections/ScreenLoader.jsx` | Create | Glass overlay, START button, crack + shatter animation |
| `styles/sections/ScreenLoader.module.css` | Create | Glass look, liquid drift animation, button styles |
| `app/page.js` | Modify | Mount ScreenLoader above Navbar with showLoader state |
| `components/sections/VideoIntro.jsx` | Modify | Listen for loader-dismissed, unmute video |

---

## Task 1: CSS — glass overlay + liquid drift + START button

**Files:**
- Create: `styles/sections/ScreenLoader.module.css`

- [ ] **Step 1: Create the CSS file**

```css
/* styles/sections/ScreenLoader.module.css */

.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(8, 8, 8, 0.82);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.2rem;
  overflow: hidden;
}

/* Animated gradient simulating liquid surface movement */
.liquidBg {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(ellipse 60% 40% at 30% 40%, rgba(247, 147, 30, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 70% 60%, rgba(255, 255, 255, 0.025) 0%, transparent 70%);
  animation: liquidDrift 9s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes liquidDrift {
  0%   { transform: scale(1.05) translate(0%, 0%) rotate(0deg); }
  33%  { transform: scale(1.08) translate(2%, -1.5%) rotate(0.4deg); }
  66%  { transform: scale(1.06) translate(-1.5%, 1%) rotate(-0.3deg); }
  100% { transform: scale(1.05) translate(1%, 2%) rotate(0.2deg); }
}

/* Thin horizontal scan line for glass texture */
.scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.008) 2px,
    rgba(255, 255, 255, 0.008) 4px
  );
  pointer-events: none;
}

.monogram {
  font-size: clamp(0.55rem, 1.2vw, 0.75rem);
  font-weight: 700;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  position: relative;
  z-index: 1;
}

.startBtn {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 1rem 3rem;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  cursor: pointer;
  transition: color 0.32s ease;
  z-index: 1;
  font-family: inherit;
}

.startBtn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.32s ease;
  z-index: -1;
}

.startBtn:hover { color: #000; }
.startBtn:hover::after { transform: scaleX(1); }
.startBtn:active { opacity: 0.85; }

/* SVG crack overlay — added to body by JS */
.crackSvg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10001;
}
```

- [ ] **Step 2: Verify file saved (no syntax errors)**

```bash
node -e "require('fs').readFileSync('/run/media/vk-kali/File Storage/E/Web_dev/vaibhav-portfolio/styles/sections/ScreenLoader.module.css'); console.log('ok')"
```

Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add styles/sections/ScreenLoader.module.css
git commit -m "feat: screen loader CSS — glass overlay, liquid drift, start button"
```

---

## Task 2: Component — ScreenLoader.jsx

**Files:**
- Create: `components/sections/ScreenLoader.jsx`

- [ ] **Step 1: Create the component**

```jsx
'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/ScreenLoader.module.css'

// 18 triangular shards tiling 100% of screen (3×3 grid, 2 triangles per cell)
const SHARDS = [
  'polygon(0% 0%, 33% 0%, 0% 33%)',
  'polygon(33% 0%, 33% 33%, 0% 33%)',
  'polygon(33% 0%, 66% 0%, 33% 33%)',
  'polygon(66% 0%, 66% 33%, 33% 33%)',
  'polygon(66% 0%, 100% 0%, 66% 33%)',
  'polygon(100% 0%, 100% 33%, 66% 33%)',
  'polygon(0% 33%, 33% 33%, 0% 66%)',
  'polygon(33% 33%, 33% 66%, 0% 66%)',
  'polygon(33% 33%, 66% 33%, 33% 66%)',
  'polygon(66% 33%, 66% 66%, 33% 66%)',
  'polygon(66% 33%, 100% 33%, 66% 66%)',
  'polygon(100% 33%, 100% 66%, 66% 66%)',
  'polygon(0% 66%, 33% 66%, 0% 100%)',
  'polygon(33% 66%, 33% 100%, 0% 100%)',
  'polygon(33% 66%, 66% 66%, 33% 100%)',
  'polygon(66% 66%, 66% 100%, 33% 100%)',
  'polygon(66% 66%, 100% 66%, 66% 100%)',
  'polygon(100% 66%, 100% 100%, 66% 100%)',
]

function generateCracks(cx, cy) {
  const paths = []
  const n = 10
  const dim = Math.max(window.innerWidth, window.innerHeight)
  for (let i = 0; i < n; i++) {
    const baseAngle = (i / n) * Math.PI * 2
    let curAngle = baseAngle + (Math.random() - 0.5) * 0.5
    const totalLen = (0.15 + Math.random() * 0.25) * dim
    const segments = 2 + Math.floor(Math.random() * 2)
    let x = cx
    let y = cy
    let d = `M ${x} ${y}`
    for (let s = 0; s < segments; s++) {
      const segLen = (totalLen / segments) * (0.7 + Math.random() * 0.6)
      curAngle += (Math.random() - 0.5) * 0.45
      x += Math.cos(curAngle) * segLen
      y += Math.sin(curAngle) * segLen
      d += ` L ${x} ${y}`
    }
    paths.push(d)
  }
  return paths
}

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)
  const btnRef     = useRef(null)

  function handleStart() {
    // Fire immediately — must stay inside the click gesture for Safari audio unlock
    window.dispatchEvent(new CustomEvent('loader-dismissed'))

    const btn = btnRef.current
    if (!btn) return
    btn.style.pointerEvents = 'none'

    const btnRect = btn.getBoundingClientRect()
    const cx = btnRect.left + btnRect.width  / 2
    const cy = btnRect.top  + btnRect.height / 2

    // ── Build crack SVG ──────────────────────────────────────
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10001;'
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
    document.body.appendChild(svg)

    const pathEls = generateCracks(cx, cy).map(d => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      el.setAttribute('d', d)
      el.setAttribute('stroke', 'rgba(255,255,255,0.72)')
      el.setAttribute('stroke-width', '1.5')
      el.setAttribute('fill', 'none')
      el.setAttribute('stroke-linecap', 'round')
      svg.appendChild(el)
      const len = el.getTotalLength()
      el.style.strokeDasharray  = len
      el.style.strokeDashoffset = len
      return el
    })

    // ── Crack animation → shatter ────────────────────────────
    gsap.to(pathEls, {
      strokeDashoffset: 0,
      duration: 0.28,
      ease: 'power2.out',
      stagger: 0.014,
      onComplete: shatter,
    })

    function shatter() {
      const overlay = overlayRef.current
      if (!overlay) return

      // Build shard container
      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;inset:0;z-index:10000;pointer-events:none;'
      document.body.appendChild(container)

      const shardEls = SHARDS.map(clipPath => {
        const el = document.createElement('div')
        el.style.cssText = [
          'position:absolute;inset:0;',
          'background:rgba(8,8,8,0.82);',
          'backdrop-filter:blur(20px) saturate(1.4);',
          '-webkit-backdrop-filter:blur(20px) saturate(1.4);',
          `clip-path:${clipPath};`,
        ].join('')
        container.appendChild(el)
        return el
      })

      // Hide original overlay immediately
      overlay.style.opacity = '0'

      const vwHalf = window.innerWidth  / 2
      const vhHalf = window.innerHeight / 2

      gsap.to(shardEls, {
        x: (_, el) => {
          const r  = el.getBoundingClientRect()
          const sx = r.left + r.width / 2
          return (sx - vwHalf) * (1.2 + Math.random() * 1.8) + (Math.random() - 0.5) * 80
        },
        y: (_, el) => {
          const r  = el.getBoundingClientRect()
          const sy = r.top + r.height / 2
          return (sy - vhHalf) * (1.2 + Math.random() * 1.8) + Math.random() * 280
        },
        rotation: () => (Math.random() - 0.5) * 44,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        stagger: { amount: 0.18, from: 'random' },
        onComplete: () => {
          container.remove()
          svg.remove()
          onDismiss()
        },
      })
    }
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.liquidBg} aria-hidden />
      <div className={styles.scanline}  aria-hidden />
      <p className={styles.monogram}>VAIBHAV KHUSHALANI</p>
      <button ref={btnRef} className={styles.startBtn} onClick={handleStart}>
        Start
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
cd "/run/media/vk-kali/File Storage/E/Web_dev/vaibhav-portfolio" && npx next build 2>&1 | grep -E "error|Error|✓ Compiled"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/sections/ScreenLoader.jsx
git commit -m "feat: ScreenLoader component — glass crack shatter animation"
```

---

## Task 3: Wire ScreenLoader into page.js

**Files:**
- Modify: `app/page.js`

- [ ] **Step 1: Add import and showLoader state**

Add to top of `app/page.js`, after existing imports:

```js
import ScreenLoader from '@/components/sections/ScreenLoader'
```

Inside `Home()`, after existing `useRef` declarations, add:

```js
const [showLoader, setShowLoader] = useState(true)
```

Also add `useState` to the React import at the top of the file (it's already imported — verify with `grep useState app/page.js`; if missing, update the import line to `import { useEffect, useRef, useState } from 'react'`).

- [ ] **Step 2: Mount ScreenLoader above Navbar in JSX**

Find the `return (` block. The opening looks like:

```jsx
return (
  <>
    {/* Full-screen fade overlay for seamless footer → top loop */}
    <div
      ref={loopOverlayRef}
      ...
    />

    <Navbar />
    <main ...>
```

Add `ScreenLoader` as the very first child inside the fragment, before the loop overlay div:

```jsx
return (
  <>
    {showLoader && (
      <ScreenLoader onDismiss={() => setShowLoader(false)} />
    )}

    {/* Full-screen fade overlay for seamless footer → top loop */}
    <div
      ref={loopOverlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 9999,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />

    <Navbar />
    <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll', overscrollBehavior: 'none' }}>
```

- [ ] **Step 3: Build check**

```bash
cd "/run/media/vk-kali/File Storage/E/Web_dev/vaibhav-portfolio" && npx next build 2>&1 | grep -E "error|Error|✓ Compiled"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4: Commit**

```bash
git add app/page.js
git commit -m "feat: mount ScreenLoader in page.js with showLoader state"
```

---

## Task 4: VideoIntro — unmute on loader-dismissed

**Files:**
- Modify: `components/sections/VideoIntro.jsx`

- [ ] **Step 1: Add loader-dismissed listener useEffect**

In `VideoIntro.jsx`, after the existing `useEffect` blocks (around line 46, after the video fade-in effect), add:

```js
// Unmute when screen loader is dismissed (fires inside user gesture — Safari safe)
useEffect(() => {
  function onLoaderDismissed() {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    setMuted(false)
    dismissHint()
  }
  window.addEventListener('loader-dismissed', onLoaderDismissed)
  return () => window.removeEventListener('loader-dismissed', onLoaderDismissed)
}, [])
```

> `dismissHint` is defined before this effect and uses only stable refs (`hintRef`, `setShowHint`) — safe with empty deps array.

- [ ] **Step 2: Build check**

```bash
cd "/run/media/vk-kali/File Storage/E/Web_dev/vaibhav-portfolio" && npx next build 2>&1 | grep -E "error|Error|✓ Compiled"
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add components/sections/VideoIntro.jsx
git commit -m "feat: VideoIntro unmutes video on loader-dismissed event"
```

---

## Task 5: Browser verification

- [ ] **Step 1: Start dev server**

```bash
cd "/run/media/vk-kali/File Storage/E/Web_dev/vaibhav-portfolio" && npm run dev
```

- [ ] **Step 2: Verify glass overlay appears on load**

Open `http://localhost:3000`. Confirm:
- Dark blurred overlay covers the full screen
- "VAIBHAV KHUSHALANI" text visible in small caps
- START button visible with orange border
- Animated gradient drift visible (subtle movement)
- Portfolio content (VideoIntro) visible but blurred underneath

- [ ] **Step 3: Verify START button hover**

Hover START button. Confirm:
- Background fills left→right with `var(--accent)` orange
- Text color changes to `#000`

- [ ] **Step 4: Verify crack animation on click**

Click START. Confirm in sequence:
1. SVG crack lines radiate from button center position (~280ms)
2. Screen shatters into triangle shards that fly off (~500ms)
3. Page is fully revealed with no overlay remnant
4. DOM: no stray `div` or `svg` left by the loader (open DevTools → Elements and confirm)

- [ ] **Step 5: Verify video unmutes**

After clicking START, confirm:
- VideoIntro video sound is unmuted (audio plays if tab was focused during click)
- Mute button icon in VideoIntro shows "unmuted" state (speaker with waves)
- "Tap for sound" hint is dismissed

- [ ] **Step 6: Verify no scroll-snap interference**

Scroll through all sections after loader dismissal. Confirm:
- Section snap still works (video → hero → about → projects → work exp → publications → footer)
- No z-index bleed from loader remnants

- [ ] **Step 7: Commit verification note**

```bash
git commit --allow-empty -m "chore: screen loader verified in browser"
```

---

## Shard polygon coverage reference

All 18 shards together tile the full viewport with no gaps:

```
Row 0 (y: 0%–33%):
  Col 0: △ (0,0)→(33,0)→(0,33)   ▽ (33,0)→(33,33)→(0,33)
  Col 1: △ (33,0)→(66,0)→(33,33) ▽ (66,0)→(66,33)→(33,33)
  Col 2: △ (66,0)→(100,0)→(66,33) ▽ (100,0)→(100,33)→(66,33)

Row 1 (y: 33%–66%):
  Col 0: △ (0,33)→(33,33)→(0,66)   ▽ (33,33)→(33,66)→(0,66)
  Col 1: △ (33,33)→(66,33)→(33,66) ▽ (66,33)→(66,66)→(33,66)
  Col 2: △ (66,33)→(100,33)→(66,66) ▽ (100,33)→(100,66)→(66,66)

Row 2 (y: 66%–100%):
  Col 0: △ (0,66)→(33,66)→(0,100)   ▽ (33,66)→(33,100)→(0,100)
  Col 1: △ (33,66)→(66,66)→(33,100) ▽ (66,66)→(66,100)→(33,100)
  Col 2: △ (66,66)→(100,66)→(66,100) ▽ (100,66)→(100,100)→(66,100)
```
