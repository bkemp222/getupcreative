import { regionalAnalyticsPolicy } from '@/lib/analytics-policy';

export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  return Response.json(regionalAnalyticsPolicy(request.headers, process.env), {
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
    },
  });
}
