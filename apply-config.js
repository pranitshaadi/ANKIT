/**
 * Reads config/wedding.config.js and patches index.html:
 *   1. Injects window.WEDDING_CONFIG before src/main.js
 *   2. Replaces ALL hardcoded Framer SSR text nodes and hrefs with config values
 *
 * Run with: node apply-config.js
 */

const fs   = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config', 'wedding.config.js');
const HTML_PATH   = path.join(__dirname, 'index.html');
const MARKER      = '<script type="module" src="src/main.js"></script>';

const config = require(CONFIG_PATH);
let html = fs.readFileSync(HTML_PATH, 'utf8');

html = html.replace(
  'typeof animator > "u") return;',
  'typeof animator > "u" || !window.__framer__appearAnimationsContent) return;'
);

// ── 1. Inject window.WEDDING_CONFIG ─────────────────────────────────────────
const injection = `<script>window.WEDDING_CONFIG = ${JSON.stringify(config, null, 2)};</script>\n    `;
html = html.replace(/<script>window\.WEDDING_CONFIG[\s\S]*?<\/script>\n?\s*/g, '');

if (!html.includes(MARKER)) {
  console.error(`ERROR: Could not find injection marker:\n  ${MARKER}`);
  process.exit(1);
}
html = html.replace(MARKER, injection + MARKER);

// ── 2. Helpers ───────────────────────────────────────────────────────────────
const enc = str => str.replace(/&/g, '&amp;');
let replacementCount = 0;

function replaceAll(from, to) {
  const count = html.split(from).length - 1;
  if (count === 0 && !html.includes(to)) {
    console.warn(`  ⚠️  No match: "${from}"`);
  }
  html = html.replaceAll(from, to);
  replacementCount += count;
}

function replaceRegex(regex, to, label) {
  const matches = html.match(regex) || [];
  if (matches.length === 0 && !html.includes(label)) {
    console.warn(`  ⚠️  No match for regex targeting: ${label}`);
  }
  html = html.replace(regex, to);
  replacementCount += matches.length;
}

// ── 3. Text node replacements ────────────────────────────────────────────────

// framer-8cgar — hero name1 UPPERCASE
replaceAll(`\n                                            ANKIT</h3>`, `\n                                            ${config.name1}</h3>`);

// framer-ti6z94 — hero name2 UPPERCASE
replaceAll(`\n                                            PRITI</h3>`, `\n                                            ${config.name2}</h3>`);

// framer-q8es40 — mantra (2 occurrences)
replaceAll(`\n                                                ॐ श्री गणेशाय नम</p>`, `\n                                                ${config.mantra}</p>`);

// framer-3xglzy — groomBlessingOf (3 occurrences)
replaceAll(`\n  With the blessings of </p>`, `\n                                                ${config.groomBlessingOf}</p>`);
replaceAll(`\n  With the blessings of </p>`, `\n                                            ${config.groomBlessingOf}</p>`);

// framer-19djrwi — groomGrandparents (3 occurrences)
replaceAll('Chain Sasmal &amp; Late Babaji Sasmal', enc(config.groomGrandparents));

// framer-ximwwv — groomParents — below the —— divider in the blessings block
replaceRegex(
  /(<div class="framer-ximwwv"[^>]*data-framer-component-type="RichTextContainer"[^>]*>[\s\S]{0,200}?<p class="framer-text"[\s\S]*?>)\s*\n(\s*)([^\n<]+?)(<\/p>)/g,
  `$1\n$2${enc(config.groomParents)}$4`,
  config.groomParents
);

// framer-10pnu1m — brideParents — paired with "Daughter of" (framer-fsyar)
replaceRegex(
  /(<div class="framer-10pnu1m"[^>]*data-framer-component-type="RichTextContainer"[^>]*>[\s\S]{0,200}?<p class="framer-text"[\s\S]*?>)\s*\n(\s*)([^\n<]+?)(<\/p>)/g,
  `$1\n$2${enc(config.brideParents)}$4`,
  config.brideParents
);

// framer-fsyar — brideRelation (2 occurrences)
replaceAll('Daughter of', config.brideRelation);

// framer-1sgfkcc — joinUsText (2 occurrences)
replaceAll(`\n                                            You to join us in the wedding celebrations of</p>`, `\n                                            ${config.joinUsText}</p>`);
// framer-13k4cyv — bride name (name2Display) large script
replaceRegex(
  /(<div class="framer-13k4cyv"[\s\S]*?<p class="framer-text"[^>]*>)\s*\n(\s*)([^\n<]+)\n(\s*<\/p>)/g,
  `$1\n$2${config.name2Display}\n$4`,
  config.name2Display
);

// framer-11ag0sw — groom name (name1Display) large script
replaceRegex(
  /(<div class="framer-11ag0sw"[\s\S]*?<p class="framer-text"[^>]*>)\s*\n(\s*)([^\n<]+)\n(\s*<\/p>)/g,
  `$1\n$2${config.name1Display}\n$4`,
  config.name1Display
);

// framer-ijl5j3 — couplesMessage (2 occurrences: desktop/tablet + phone)
// The text is wrapped across multiple indented lines — replace the whole <p> content
replaceRegex(
  /(<div class="framer-ijl5j3"[\s\S]*?<p class="framer-text"[^>]*>)([\s\S]*?)(<\/p>)/g,
  `$1\n                                                ${config.couplesMessage}$3`,
  config.couplesMessage.slice(0, 30)
);

// ── 4. href replacements ─────────────────────────────────────────────────────

// framer-cdl7V map CTA — first cdl7V <a> with maps href
replaceAll('href="https://maps.app.goo.gl/CotNnjBZ9CPivikV7"', `href="${config.mapsCtaLink}"`);

// framer-cdl7V RSVP CTA — whatsapp href
replaceAll('href="https://wa.me/91XXXXXXXXXX"', `href="${config.whatsappRsvpLink}"`);

// framer-cdl7V Instagram CTA — currently href="#"
// Only replace the Section 3 anchor (Instagram), not any other href="#"
replaceAll('data-framer-name="Section 3" href="#"', `data-framer-name="Section 3" href="${config.instagramCtaLink || '#'}"`);

// Remove Framer's own audio source + autoplay (MusicPlayer.js owns the music)
html = html.replace(
  /<audio src="assets\/media\/background_music_mono\.mp3" loop class="framer-audio" preload="metadata"\s*autoplay><\/audio>/g,
  '<audio loop class="framer-audio" preload="none"></audio>'
);

// Strip Framer's ?width=…&scale-down-to=… query strings so each image has ONE url
const IMG_QUERY = /(assets\/[\w@.\/-]+\.(?:png|jpe?g|webp))\?[^`"'\s,)]*/g;
html = html.replace(IMG_QUERY, '$1');

// ── 5. Write output ──────────────────────────────────────────────────────────
fs.writeFileSync(HTML_PATH, html, 'utf8');

// ── 6. Patch Framer JS bundle — hardcoded React props override SSR at runtime ─
const MJS_GLOB = path.join(__dirname, 'assets', 'js', '*.mjs');
const { execSync } = require('child_process');
const mjsFiles = execSync(`ls "${path.join(__dirname, 'assets', 'js')}"`)
  .toString().trim().split('\n')
  .filter(f => f.endsWith('.mjs'))
  .map(f => path.join(__dirname, 'assets', 'js', f));

let mjsPatched = 0;
for (const mjsPath of mjsFiles) {
  let mjs = fs.readFileSync(mjsPath, 'utf8');
  let changed = false;

  // framer-FqwEu (Groom's family names) — SwyWMQuoO prop = groomParents
  const fqweuOld = /SwyWMQuoO: `[^`]+`(, variant:)/g;
  const fqweuNew = `SwyWMQuoO: \`${config.groomParents}\`$1`;
  if (fqweuOld.test(mjs)) { mjs = mjs.replace(fqweuOld, fqweuNew); changed = true; }

  // framer-nva0a (Bride's family names) — PF8ftF8Ur = brideParents, sKFuJb5xa = brideRelation
  const nva0aOld = /PF8ftF8Ur: `[^`]+`, sKFuJb5xa: `[^`]+`(, style:)/g;
  const nva0aNew = `PF8ftF8Ur: \`${config.brideParents}\`, sKFuJb5xa: \`${config.brideRelation}\`$1`;
  if (nva0aOld.test(mjs)) { mjs = mjs.replace(nva0aOld, nva0aNew); changed = true; }

  const noQuery = mjs.replace(IMG_QUERY, '$1');
  if (noQuery !== mjs) { mjs = noQuery; changed = true; }

  // Strip srcFile so Framer's player doesn't download the audio on load
  if (mjs.includes('srcFile: `assets/media/background_music_mono.mp3`')) {
    mjs = mjs.replace('srcFile: `assets/media/background_music_mono.mp3`', 'srcFile: ``');
    changed = true;
  }

  // Music player — disable autoplay on load
  if (mjs.includes('playing: !0, progress: 0')) {
    mjs = mjs.replace('playing: !0, progress: 0', 'playing: !1, progress: 0');
    changed = true;
  }

  if (changed) { fs.writeFileSync(mjsPath, mjs, 'utf8'); mjsPatched++; }
}
console.log(`✅  index.html patched — WEDDING_CONFIG injected, ${replacementCount} node(s) replaced. ${mjsPatched} .mjs bundle(s) patched.`);
