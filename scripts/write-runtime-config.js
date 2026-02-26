#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const variant = process.env.APP_VARIANT || 'rangers';

const config = {
  clubSlug: process.env.EXPO_PUBLIC_CLUB_SLUG || variant,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002',
  assetVariant: variant,
  useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true' ? 'true' : 'false',
};

const outPath = path.join(__dirname, '..', 'lib', 'generated-config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + '\n');
console.log('Runtime config written:', JSON.stringify(config));

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const faviconSrc = path.join(__dirname, '..', 'assets', 'clubs', variant, 'favicon.png');
const fallback = path.join(__dirname, '..', 'assets', '_default', 'favicon.png');
const src = fs.existsSync(faviconSrc) ? faviconSrc : fallback;
fs.copyFileSync(src, path.join(publicDir, 'favicon.png'));
console.log('Favicon copied from:', path.relative(path.join(__dirname, '..'), src));
