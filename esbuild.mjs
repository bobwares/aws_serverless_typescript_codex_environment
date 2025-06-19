/**
 * App: Customer API
 * Package: build
 * File: esbuild.mjs
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:25:35Z
 * Description: Builds TypeScript Lambda handlers into ESM JavaScript using
 *              esbuild for deployment.
 */

import { build } from 'esbuild';
import { readdirSync, statSync } from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const handlersDir = join(__dirname, 'src', 'handlers');
const outdir = join(__dirname, 'dist', 'handlers');

function findTsFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    return statSync(full).isDirectory()
        ? findTsFiles(full)
        : extname(full) === '.ts' ? [full] : [];
  });
}

const entryPoints = findTsFiles(handlersDir);

for (const entry of entryPoints) {
  const fileName = entry.split('/').pop().replace(/\.ts$/, '.mjs');
  await build({
    entryPoints: [entry],
    platform: 'node',
    bundle: true,
    target: ['node20'],
    format: 'esm',
    outfile: join(outdir, fileName),
    sourcemap: false,
    external: ['aws-sdk'],
  });
}
