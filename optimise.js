/**
 * Shrinks the site's images IN PLACE (same file names, same formats, so no HTML/JS
 * changes are needed). Run once:   npm i -D sharp && node optimize-images.js
 * Commit first, so git keeps the originals.
 *
 *  - never upscales; only resizes images wider than the limit
 *  - PNG  -> 8-bit palette PNG (keeps transparency), much smaller for illustrations
 *  - JPEG -> mozjpeg quality 75, progressive
 *  - skips files under 120 kB and any file that wouldn't shrink by at least 10%
 *    (so running it twice is harmless)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, 'assets');
const MIN_BYTES = 120 * 1024;

// Max width in px (a phone is ~440 css px wide, so 1200 is already ~2.7x).
const rules = [
  { match: /images[\\/]couple[\\/]/, maxWidth: 900 },   // gallery photos
  { match: /./,                        maxWidth: 1200 }, // everything else
];
const limitFor = file => rules.find(r => r.match.test(file)).maxWidth;

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) yield p;
  }
}

(async () => {
  let before = 0, after = 0;
  for (const file of walk(ROOT)) {
    const size = fs.statSync(file).size;
    if (size < MIN_BYTES) continue;

    const isPng = /\.png$/i.test(file);
    let img = sharp(file, { failOn: 'none' }).rotate();           // honour EXIF orientation
    const meta = await sharp(file).metadata();
    const maxWidth = limitFor(file);
    if (meta.width > maxWidth) img = img.resize({ width: maxWidth, withoutEnlargement: true });

    const out = isPng
      ? await img.png({ palette: true, quality: 85, effort: 10, compressionLevel: 9 }).toBuffer()
      : await img.jpeg({ quality: 75, mozjpeg: true, progressive: true }).toBuffer();

    const rel = path.relative(__dirname, file);
    if (out.length < size * 0.9) {   // needs a real saving, so re-runs don't re-compress
      fs.writeFileSync(file, out);
      before += size; after += out.length;
      console.log(`✓ ${rel}  ${(size/1024)|0} kB → ${(out.length/1024)|0} kB  (${meta.width}px → ${Math.min(meta.width, maxWidth)}px)`);
    } else {
      console.log(`– ${rel}  left as is (no meaningful saving)`);
    }
  }
  console.log(`\nTotal: ${(before/1048576).toFixed(1)} MB → ${(after/1048576).toFixed(1)} MB`);
})();