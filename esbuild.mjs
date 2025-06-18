// App: CustomerAPI
// Directory: project root
// File: esbuild.mjs
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Build script for Lambda functions.

import { build } from 'esbuild';
import { glob } from 'glob';
import { mkdir, cp } from 'fs/promises';

const entryPoints = await glob('src/handlers/*.ts');
await mkdir('dist', { recursive: true });
for (const file of entryPoints) {
  const outfile = `dist/${file.replace('src/handlers/', '').replace('.ts', '.mjs')}`;
  await build({ entryPoints: [file], bundle: true, platform: 'node', target: 'node20', outfile, format: 'esm' });
}
await cp('src/customerProfile.schema.json', 'dist/customerProfile.schema.json');
