import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-static';
export async function GET() {
  const logo = await readFile(join(process.cwd(), 'public/brand/getup_logo.png'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#282827', borderTop: '14px solid #ffa313', borderBottom: '14px solid #ffa313' }}>
      {/* ImageResponse embeds the existing artwork; this is not a browser image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Get Up Creative Co." src={`data:image/png;base64,${logo.toString('base64')}`} width={640} height={374} />
    </div>,
    { width: 1200, height: 630 },
  );
}
