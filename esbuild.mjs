// App: Customer API
// path: esbuild.mjs
// File: esbuild.mjs
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Build script bundling all Lambda handlers using esbuild
//              into individual zip archives stored in the dist folder.
// 
import { build } from 'esbuild';
import { join } from 'path';
import { promises as fs } from 'fs';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const outDir = 'dist';
const handlers = [
  'createCustomer',
  'getCustomer',
  'updateCustomer',
  'patchCustomer',
  'deleteCustomer',
  'searchCustomers',
  'getOperation',
];

await fs.mkdir(outDir, { recursive: true });

await Promise.all(
  handlers.map(async (name) => {
    const entry = `src/handlers/${name}.ts`;
    const outfile = join(outDir, `${name}.js`);
    await build({ entryPoints: [entry], bundle: true, platform: 'node', target: 'node20', outfile, format: 'esm' });
    const archive = archiver('zip');
    const zipPath = join(outDir, `${name}.zip`);
    const output = createWriteStream(zipPath);
    archive.pipe(output);
    archive.file(outfile, { name: 'index.mjs' });
    await archive.finalize();
  }),
);
