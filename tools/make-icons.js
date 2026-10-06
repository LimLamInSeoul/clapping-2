// Generates the PWA icons (no dependencies): node tools/make-icons.js
// Draws the Clapping Music pattern as two rows of 12 dots: part 1 (blue) over part 2 (amber).
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const BG = [15, 22, 32], P1 = [134, 168, 224], P2 = [242, 166, 58], RING = [42, 55, 69];
const PAT = [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, safe) {
  const px = Buffer.alloc(size * size * 3);
  const set = (x, y, c, a) => {
    const i = (y * size + x) * 3;
    for (let k = 0; k < 3; k++) px[i + k] = Math.round(px[i + k] * (1 - a) + c[k] * a);
  };
  for (let i = 0; i < size * size; i++) BG.forEach((v, k) => (px[i * 3 + k] = v));
  const area = size * safe, x0 = (size - area) / 2;
  const step = area / 12, r = step * 0.38;
  const disc = (cx, cy, rad, c, ring) => {
    for (let y = Math.floor(cy - rad - 1); y <= cy + rad + 1; y++)
      for (let x = Math.floor(cx - rad - 1); x <= cx + rad + 1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        let a = Math.max(0, Math.min(1, rad - d + 0.5));
        if (ring) a = Math.min(a, Math.max(0, Math.min(1, d - (rad - step * 0.08) + 0.5)));
        if (a > 0) set(x, y, c, a);
      }
  };
  const rows = [[PAT, P1], [PAT.map((_, i) => PAT[(i + 3) % 12]), P2]];
  rows.forEach(([pat, col], ri) => {
    const cy = size / 2 + (ri === 0 ? -1 : 1) * step * 0.75;
    pat.forEach((on, i) => disc(x0 + step * (i + 0.5), cy, r, on ? col : RING, !on));
  });
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) px.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}
const out = path.join(__dirname, "..", "icons");
fs.writeFileSync(path.join(out, "icon-192.png"), png(192, 0.86));
fs.writeFileSync(path.join(out, "icon-512.png"), png(512, 0.86));
fs.writeFileSync(path.join(out, "icon-maskable-512.png"), png(512, 0.7));
console.log("icons written");
