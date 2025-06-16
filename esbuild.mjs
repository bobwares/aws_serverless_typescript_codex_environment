import { build } from 'esbuild';
import { rm, mkdir } from 'fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await build({
  entryPoints: ['src/handlers/createCustomer.js', 'src/handlers/getCustomer.js'],
  outdir: 'dist',
  platform: 'node',
  target: 'node20',
  format: 'esm',
  bundle: true,
  sourcemap: true,
});
