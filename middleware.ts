import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude webhooks from all security/maintenance logic
  if (pathname.startsWith('/api/webhook')) {
    return NextResponse.next();
  }

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode && !pathname.startsWith('/admin') && pathname !== '/maintenance.html') {
    return NextResponse.rewrite(new URL('/maintenance.html', request.url), {
      status: 503,
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};