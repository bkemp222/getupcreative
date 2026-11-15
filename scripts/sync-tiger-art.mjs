import { readFile, writeFile } from 'node:fs/promises';

// Preserve Illustrator's exact path data; fail if the source structure changes.
const source = await readFile(new URL('../assets/tigerstripes.svg', import.meta.url), 'utf8');
const viewBox = source.match(/viewBox="([^"]+)"/)?.[1];
const paths = [...source.matchAll(/<path\s+d="([^"]+)"\s*\/>/g)].map(match => match[1]);
const remainder = source.replace(/<\?xml[\s\S]*?\?>|<!--[\s\S]*?-->|<\/?svg\b[^>]*>|<path\s+d="[^"]+"\s*\/>/g, '').trim();
if (viewBox !== '0 0 1920 1920' || !paths.length || remainder) throw new Error('Tiger SVG structure changed. Inspect the artwork before updating its inline adapter.');
await writeFile(new URL('../src/lib/tiger-art.ts', import.meta.url), `// Generated from assets/tigerstripes.svg by scripts/sync-tiger-art.mjs. Do not edit.\nexport const tigerViewBox = ${JSON.stringify(viewBox)};\nexport const tigerPaths = ${JSON.stringify(paths, null, 2)};\n`);
