#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const config = {
  clubSlug: process.env.EXPO_PUBLIC_CLUB_SLUG || process.env.APP_VARIANT || 'rangers',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002',
  assetVariant: process.env.APP_VARIANT || 'rangers',
  useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true' ? 'true' : 'false',
};

const outPath = path.join(__dirname, '..', 'lib', 'generated-config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + '\n');
console.log('Runtime config written:', JSON.stringify(config));
