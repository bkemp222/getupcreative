import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Preserve the previous image URL for older shared links, using the exact artwork.
export const dynamic = 'force-static';
export async function GET() {
  const image = await readFile(join(process.cwd(), 'public/social_1200x630.png'));
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png' } });
}
