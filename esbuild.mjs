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
import { glob } from 'glob';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outdir = join(__dirname, 'dist/handlers');
const entryPoints = glob.sync('src/handlers/*.ts');

for (const entry of entryPoints) {
    await build({
        entryPoints: [entry],
        platform: 'node',
        bundle: true,
        target: 'node20',
        outfile: join(outdir, entry.split('/').pop().replace('.ts', '.mjs')),
        format: 'esm',
        sourcemap: false,
        external: ['aws-sdk'],
    });
}