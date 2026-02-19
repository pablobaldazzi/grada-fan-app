#!/usr/bin/env npx tsx
/**
 * Sync club app icon and splash assets from backend logo.
 * Usage: npx tsx scripts/sync-club-assets.ts <slug>
 * Example: npx tsx scripts/sync-club-assets.ts rangers
 *
 * Uses EXPO_PUBLIC_API_BASE_URL from env (or .env). If fetch fails or no logo, copies from assets/_default/.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: npx tsx scripts/sync-club-assets.ts <slug>');
  console.error('Example: npx tsx scripts/sync-club-assets.ts rangers');
  process.exit(1);
}

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002';
const clubsUrl = `${apiBaseUrl.replace(/\/$/, '')}/public/clubs/${slug}`;
const outDir = path.join(process.cwd(), 'assets', 'clubs', slug);
const defaultDir = path.join(process.cwd(), 'assets', '_default');

async function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data) as T);
          } catch {
            reject(new Error('Invalid JSON response'));
          }
        });
      })
      .on('error', reject);
  });
}

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function copyFromDefault() {
  if (!fs.existsSync(defaultDir)) {
    console.error(
      `Fallback dir ${defaultDir} not found. Create assets/_default/ with icon.png, splash-icon.png, etc.`
    );
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const files = [
    'icon.png',
    'splash-icon.png',
    'android-icon-foreground.png',
    'android-icon-background.png',
    'android-icon-monochrome.png',
    'favicon.png',
  ];
  for (const f of files) {
    const src = path.join(defaultDir, f);
    const dest = path.join(outDir, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${f} from _default`);
    }
  }
}

async function main() {
  let club: { logoUrl?: string; fullLogoUrl?: string };
  try {
    club = await fetchJson<{ logoUrl?: string; fullLogoUrl?: string }>(
      clubsUrl
    );
  } catch (err) {
    console.warn(
      `Failed to fetch club from ${clubsUrl}:`,
      (err as Error).message
    );
    console.warn('Using fallback assets from _default');
    copyFromDefault();
    return;
  }

  const logoUrl = club.fullLogoUrl || club.logoUrl;
  if (!logoUrl) {
    console.warn('Club has no logoUrl or fullLogoUrl. Using fallback.');
    copyFromDefault();
    return;
  }

  try {
    const sharp = require('sharp');
    const imgBuffer = await downloadImage(logoUrl);
    const image = sharp(imgBuffer);

    fs.mkdirSync(outDir, { recursive: true });

    // Icon 1024x1024
    await image
      .clone()
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outDir, 'icon.png'));
    console.log('Generated icon.png');

    // Splash icon 1024x1024 (same as icon for simplicity)
    await image
      .clone()
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outDir, 'splash-icon.png'));
    console.log('Generated splash-icon.png');

    // Android adaptive: foreground 432x432, background solid, monochrome
    await image
      .clone()
      .resize(432, 432)
      .png()
      .toFile(path.join(outDir, 'android-icon-foreground.png'));
    console.log('Generated android-icon-foreground.png');

    // Background: solid dark color matching app theme
    await sharp({
      create: {
        width: 432,
        height: 432,
        channels: 3,
        background: { r: 10, g: 10, b: 10 },
      },
    })
      .png()
      .toFile(path.join(outDir, 'android-icon-background.png'));
    console.log('Generated android-icon-background.png');

    // Monochrome: grayscale of foreground
    await image
      .clone()
      .resize(432, 432)
      .grayscale()
      .png()
      .toFile(path.join(outDir, 'android-icon-monochrome.png'));
    console.log('Generated android-icon-monochrome.png');

    // Favicon 48x48
    await image
      .clone()
      .resize(48, 48)
      .png()
      .toFile(path.join(outDir, 'favicon.png'));
    console.log('Generated favicon.png');

    console.log(`Done. Assets written to ${outDir}`);
  } catch (err) {
    console.warn('Image processing failed:', (err as Error).message);
    console.warn('Using fallback assets from _default');
    copyFromDefault();
  }
}

main();
