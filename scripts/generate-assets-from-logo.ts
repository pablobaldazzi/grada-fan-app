#!/usr/bin/env npx tsx
/**
 * Generate app assets (icon, splash, android adaptive, favicon) from a logo PNG.
 *
 * Usage: npx tsx scripts/generate-assets-from-logo.ts <input.png> <slug> [bgHex]
 * Example: npx tsx scripts/generate-assets-from-logo.ts ./escudo.png deportes-concepcion #6C3483
 *
 * The icon.png (app store) and android assets use the solid background color.
 * The splash-icon.png (loading screen) and favicon.png use a transparent background
 * so the logo fills more space and blends with any screen color.
 */

import * as fs from 'fs';
import * as path from 'path';

const inputPath = process.argv[2];
const slug = process.argv[3];
const bgHex = process.argv[4] || '#6C3483';

if (!inputPath || !slug) {
  console.error('Usage: npx tsx scripts/generate-assets-from-logo.ts <input.png> <slug> [bgHex]');
  console.error('Example: npx tsx scripts/generate-assets-from-logo.ts ./escudo.png deportes-concepcion #6C3483');
  process.exit(1);
}

const outDir = path.join(process.cwd(), 'assets', 'clubs', slug);
const resolvedInput = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);

if (!fs.existsSync(resolvedInput)) {
  console.error(`Input file not found: ${resolvedInput}`);
  process.exit(1);
}

// Parse hex to RGB for sharp
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 108, g: 52, b: 131 };
}

async function main() {
  const sharp = require('sharp');
  const bg = hexToRgb(bgHex);
  const bgRgba = { r: bg.r, g: bg.g, b: bg.b, alpha: 1 };

  const logoBuffer = fs.readFileSync(resolvedInput);
  const logo = sharp(logoBuffer);
  const { width: logoW, height: logoH } = await logo.metadata();

  fs.mkdirSync(outDir, { recursive: true });

  async function createComposite(
    size: number,
    padding = 0.15,
    transparent = false,
  ) {
    const pad = Math.round(size * padding);
    const innerSize = size - pad * 2;
    const scale = Math.min(innerSize / (logoW || 1), innerSize / (logoH || 1));
    const scaledW = Math.round((logoW || 1) * scale);
    const scaledH = Math.round((logoH || 1) * scale);
    const left = Math.round((size - scaledW) / 2);
    const top = Math.round((size - scaledH) / 2);

    const background = transparent
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : bgRgba;

    const resizedLogo = await logo
      .clone()
      .resize(scaledW, scaledH)
      .png()
      .toBuffer();

    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background,
      },
    })
      .png()
      .composite([{ input: resizedLogo, left, top }]);
  }

  // Icon 1024x1024 (app store - needs solid background)
  await (await createComposite(1024))
    .png()
    .toFile(path.join(outDir, 'icon.png'));
  console.log('Generated icon.png (1024x1024)');

  // Splash icon 1024x1024 (loading screen - transparent, less padding)
  await (await createComposite(1024, 0.04, true))
    .png()
    .toFile(path.join(outDir, 'splash-icon.png'));
  console.log('Generated splash-icon.png (1024x1024, transparent)');

  // Android foreground 432x432
  await (await createComposite(432))
    .png()
    .toFile(path.join(outDir, 'android-icon-foreground.png'));
  console.log('Generated android-icon-foreground.png (432x432)');

  // Android background: solid color
  await sharp({
    create: {
      width: 432,
      height: 432,
      channels: 3,
      background: { r: bg.r, g: bg.g, b: bg.b },
    },
  })
    .png()
    .toFile(path.join(outDir, 'android-icon-background.png'));
  console.log('Generated android-icon-background.png (432x432)');

  // Android monochrome: grayscale of logo on bg
  const mono = await createComposite(432);
  await (await mono)
    .grayscale()
    .png()
    .toFile(path.join(outDir, 'android-icon-monochrome.png'));
  console.log('Generated android-icon-monochrome.png (432x432)');

  // Favicon 48x48 (transparent, minimal padding)
  await (await createComposite(48, 0.04, true))
    .png()
    .toFile(path.join(outDir, 'favicon.png'));
  console.log('Generated favicon.png (48x48, transparent)');

  console.log(`\nDone. Assets written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
