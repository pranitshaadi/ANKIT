# Project Structure

## Directory Layout

```
MissingPieceFramerInvitation/
├── config/
│   └── wedding.config.js       # Single source of truth for all personalisation
├── src/
│   ├── main.js                 # Entry point — wires all modules together
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Countdown.js    # Live countdown timer (exports initDateReveal)
│   │   │   └── MusicPlayer.js  # Floating background music player
│   │   ├── sections/
│   │   │   └── Events.js       # 3-D flip event cards + .ics download
│   │   └── layout/
│   │       ├── Navigation.js   # Active-section highlight via IntersectionObserver
│   │       └── Watermark.js    # Injects CSS to hide Framer "Buy Now" badge
│   ├── utils/
│   │   ├── animation.js        # Scroll-triggered [data-animate] → .is-visible
│   │   ├── scroll.js           # Smooth-scroll helpers
│   │   ├── config-loader.js    # Reads window.WEDDING_CONFIG (set by index.html)
│   │   ├── date.js             # Date formatting utilities
│   │   └── dom.js              # DOM query helpers + escapeHtml
│   └── styles/
│       └── main.css            # All custom CSS (card flip, gallery, animations,
│                               #   Things to Know override, date-reveal blend,
│                               #   countdown heading, presence text glow)
├── assets/
│   ├── fonts/                  # Local woff2 font files (referenced by index.html)
│   ├── images/
│   │   ├── background/         # Full-page background PNGs
│   │   │   └── 2dFaPNHiZWIx3VvP26NqORM2vMY.png  # Floral bg for Section 3
│   │   ├── couple/             # Couple photo gallery (Image-1..7.jpeg)
│   │   ├── elements/           # Decorative icons and logos
│   │   └── frame/              # Ornamental frame overlays
│   ├── js/                     # Framer compiled .mjs bundles — DO NOT EDIT
│   └── media/
│       └── background_music_mono.mp3
├── index.html                  # Framer SSR output — DO NOT EDIT MANUALLY
├── apply-config.js             # Patches index.html from wedding.config.js
├── package.json
└── README.md
```

## Core Components and Relationships

```
main.js
  ├── getConfig()                  ← config-loader.js reads window.WEDDING_CONFIG
  ├── initOptimizedImages()        ← inline MutationObserver for image src swaps
  ├── initSmoothScroll()           ← utils/scroll.js
  ├── initScrollAnimations()       ← utils/animation.js
  ├── initNavigation()             ← layout/Navigation.js
  ├── initCountdownHeading()       ← inline — injects "Countdown Begins..." into .framer-jcebrp
  ├── initPresenceText()           ← inline — injects glowing text into .framer-1rq20ml
  ├── initGroomAndBrideHeading()   ← inline — overrides hardcoded "bride and groom" in .framer-ewzo4f
  ├── initCoupleNameDisplay()      ← inline — fixes swapped names in hero + invite sections
  │     • .framer-1if6ejn-container: framer-ti6z94 (groom UPPER), framer-8cgar (bride UPPER)
  │     • .framer-igjlsv-container: framer-11ag0sw (groom), framer-13k4cyv (bride)
  ├── initRepurposedCards()        ← inline — overrides 4 hardcoded event names in .mjs
  │     • framer-1xxttys → "Mehendi"      (was "Engagement")
  │     • framer-y390rh  → "Mangana Handi" (was "Mehendi")
  │     • framer-v371mv  → "Sangeet"      (was "Reception")
  │     • framer-8j9rab  → "Reception"    (was "Mangana Handi")
  ├── initMapsCtaLink()            ← inline — patches maps CTA href
  ├── initEventFieldOverrides()    ← inline — patches date/venue/time on all 6 cards from config
  ├── initDateReveal()             ← ui/Countdown.js
  ├── initMusicPlayer()            ← ui/MusicPlayer.js (guarded by config.musicUrl)
  └── initEventCards()             ← sections/Events.js (guarded by config.eventCardBack)
```

## Key Section Identifiers (Framer class names)

| Class | Section |
|---|---|
| `.framer-1if6ejn-container` | Hero names (ANKIT / WEDS / PRITI) |
| `.framer-igjlsv-container` | Invite section couple names (Ankit & Priti) |
| `.framer-ewzo4f` | "groom and bride" heading in meet section |
| `.framer-jcebrp` | Things to Know — shows floral bg + "Countdown Begins..." |
| `.framer-1ytz0ta` | Inner content of Things to Know — hidden via CSS |
| `.framer-1vpz21r` | Section 3 wrapper — carries floral bg image |
| `.framer-1rq20ml` | Footer lanterns / Names section — presence text injected here |
| `.framer-bju1kx` | Footer |
| `.framer-qkait7` | Countdown timer area in footer |
| `.framer-vr8qqo` | Event cards flex container |

## Event Card Container → Display Name Mapping

| Container | Display Name | CSS Order | Framer Hardcoded |
|---|---|---|---|
| `.framer-1xxttys-container` | Mehendi | 1 | "Engagement" |
| `.framer-v371mv-container` | Sangeet | 2 | "Reception" |
| `.framer-1mhegaa-container` | Haldi | 3 | "Haldi" ✅ |
| `.framer-y390rh-container` | Mangana Handi | 4 | "Mehendi" |
| `.framer-15hmep-container` | Baarat | 5 | "Baarat" ✅ |
| `.framer-8j9rab-container` | Reception | 6 | "Mangana Handi" |

## Architectural Patterns

- **Framer + custom layer**: `index.html` and `assets/js/*.mjs` are Framer artefacts; all custom logic lives exclusively in `src/`.
- **Config-driven rendering**: `window.WEDDING_CONFIG` is injected into `index.html` by `apply-config.js`; `config-loader.js` reads it at runtime with a safe `?? {}` fallback.
- **Init-function module pattern**: every module exports a single `initXxx()` function; `main.js` calls them in order after `DOMContentLoaded`.
- **MutationObserver injection pattern**: all runtime DOM corrections use `MutationObserver` with a duplicate/value guard. This is mandatory for any content Framer JS re-renders.
- **Target deepest styled element**: when overriding Framer text, target the `h3`/`h2`/`p` leaf that carries inline CSS styles — never the outer wrapper — to preserve font/colour/size.
- **CSS suppression of Framer content**: unwanted Framer content is hidden with `display: none !important` and replaced via CSS `::before` or injected DOM nodes.
- **IntersectionObserver for scroll effects**: both `Navigation.js` and `animation.js` use `IntersectionObserver` — no scroll-event listeners.
- **CSS-class toggling**: interactivity (active nav, visible animations, card flip) is driven by adding/removing CSS classes (`.is-active`, `.is-visible`, `.is-flipped`).
- **No build step for custom code**: `src/main.js` is loaded as `type="module"` directly from `index.html`; no bundler is needed.
