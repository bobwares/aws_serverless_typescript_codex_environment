import { build } from 'esbuild';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { gzip } from 'zlib';

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

await fs.rm('dist', { recursive: true, force: true });
await fs.mkdir('dist', { recursive: true });

for (const name of handlers) {
  const outfile = `dist/${name}.js`;
  await build({
    entryPoints: [`src/handlers/${name}.ts`],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile,
  });
  const zip = createWriteStream(`dist/${name}.zip`);
  const input = createReadStream(outfile);
  const gzipper = gzip();
  await pipeline(input, gzipper, zip);
}
