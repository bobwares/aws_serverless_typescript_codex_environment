/*
# App: CustomerProfileAPI
# Package: build
# File: build.mjs
# Version: 0.1.1
# Author: ServerlessArchitectBot
# Date: 2025-06-17T01:40:00Z
# Description: Bundle handlers with esbuild and zip for deployment.
*/

import { build } from 'esbuild';
import { rm, mkdir } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const handlers = [
  'createCustomer',
  'updateCustomer',
  'patchCustomer',
  'deleteCustomer',
  'getCustomer',
  'listByEmail',
  'operationStatus',
  'worker',
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

for (const name of handlers) {
  const outfile = `dist/${name}.js`;
  await build({
    entryPoints: [`src/handlers/${name}.ts`],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile,
  });
  await execFileAsync('zip', ['-j', `dist/${name}.zip`, outfile]);
}
