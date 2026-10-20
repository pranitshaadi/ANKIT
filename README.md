# Indian Wedding Invitation Design - Scroll 

A customisable Indian wedding invitation website exported from Framer.

## Project structure

```
PRANIT-WEDDING-INVI/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Countdown.js      – live countdown timer
│   │   │   └── Button.js         – background music player
│   │   ├── sections/
│   │   │   └── Events.js         – 3-D flip event cards + .ics download
│   │   └── layout/
│   │       ├── Navigation.js     – active-section highlight
│   │       └── Watermark.js      – hides Framer "Buy Now" badge
│   ├── utils/
│   │   ├── animation.js          – scroll-triggered animations
│   │   ├── scroll.js             – smooth-scroll helpers
│   │   └── config-loader.js      – reads window.WEDDING_CONFIG
│   ├── styles/
│   │   └── main.css              – all custom CSS (card flip, gallery fix …)
│   └── main.js                   – application entry point
├── assets/
│   ├── fonts/                    – local woff2 font files
│   ├── images/
│   │   ├── background/
│   │   ├── couple/
│   │   ├── elements/
│   │   └── frame/
│   ├── js/                       – Framer build artefacts (do not edit)
│   └── media/
│       └── background_music_mono.mp3
├── config/
│   └── wedding.config.js         – ✏️  edit this to customise the invite
├── index.html                    – Framer SSR output (do not edit manually)
├── package.json
└── README.md
```

## Customising the invite

Open **`config/wedding.config.js`** and edit the values — names, dates, venues,
links, music, event card back-face content, etc.

After editing, run:

```bash
node apply-config.js
```

## Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Assets

| Folder | Contents |
|---|---|
| `assets/fonts/` | Local woff2 files referenced by `index.html` |
| `assets/images/` | Background, couple photos, decorative elements, frame |
| `assets/media/` | Background music MP3 |
| `assets/js/` | Framer compiled bundles — **do not edit** |

## Notes

- `assets/js/*.mjs` are Framer's compiled output and must not be restructured.
- All custom hand-authored logic lives exclusively in `src/`.
- `src/styles/main.css` is linked from `index.html`; Framer's own CSS remains
  inline in the HTML as generated.
