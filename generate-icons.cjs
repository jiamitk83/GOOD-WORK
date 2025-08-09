const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const src = 'icon-source.png'; // Your source image
const outDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

sizes.forEach(size => {
  sharp(src)
    .resize(size, size)
    .toFile(path.join(outDir, `icon-${size}x${size}.png`), (err) => {
      if (err) console.error(`Error creating icon-${size}x${size}.png:`, err);
      else console.log(`Created icon-${size}x${size}.png`);
    });
});
