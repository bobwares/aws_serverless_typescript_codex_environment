import { build } from 'esbuild';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const handlers = ['createCustomer', 'getCustomer', 'updateCustomer', 'deleteCustomer', 'searchCustomer', 'getOperation'];
const outDir = join(__dirname, 'dist');
await fs.mkdir(outDir, { recursive: true });

for (const name of handlers) {
  const outfile = join(outDir, `${name}.mjs`);
  await build({
    entryPoints: [join(__dirname, 'src/handlers', `${name}.ts`)],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile,
    format: 'esm',
  });
  const zipFile = join(outDir, `${name}.zip`);
  await execAsync(`zip -j ${zipFile} ${outfile}`);
}
