/**
 * App: Customer API
 * Package: build
 * File: esbuild.mjs
 * Version: 0.3.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-25T20:30:00Z
 * Description: Builds each TypeScript Lambda handler into its own
 *              CommonJS JS file under a dedicated folder.
 */

import { build } from 'esbuild';
import { readdirSync, statSync, mkdirSync } from 'fs';
import { dirname, join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const handlersDir = join(__dirname, 'src', 'handlers');
const baseOutDir = join(__dirname, 'dist', 'handlers');

/** Recursively find all .ts files under a directory */
function findTsFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const full = join(dir, name);
    return statSync(full).isDirectory()
        ? findTsFiles(full)
        : extname(full) === '.ts'
            ? [full]
            : [];
  });
}

const entries = findTsFiles(handlersDir);

for (const entry of entries) {
  // e.g. 'src/handlers/create.ts' → handlerName = 'create'
  const handlerName = basename(entry, '.ts');

  // create the per-handler output folder
  const outDir = join(baseOutDir, handlerName);
  mkdirSync(outDir, { recursive: true });

  // output file: dist/handlers/<handlerName>/<handlerName>.js
  const outfile = join(outDir, `${handlerName}.js`);

  console.log(`Building handler "${handlerName}" → ${outfile}`);

  await build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    target: ['node20'],
    format: 'cjs',
    outfile,
    sourcemap: false,
    external: ['aws-sdk'],

    // ensure Lambda sees a real CJS export
    footer: {
      js: 'module.exports = { handler };',
    },
  });
}
