import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_CONFIG } from "@/config/app.config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Maintenance Mode Gate
  if (APP_CONFIG.features.maintenanceMode && !pathname.startsWith("/maintenance") && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // 2. Geo-Blocking Check for Restricted Indian States
  // In production, platforms like Vercel provide 'x-vercel-ip-country-region'
  const region = request.headers.get("x-vercel-ip-country-region") || request.cookies.get("user_region")?.value;
  if (region && APP_CONFIG.features.blockedRegions.includes(region.toUpperCase())) {
    // Block real-money wagering routes
    if (pathname.startsWith("/wallet/add") || pathname.startsWith("/tournaments/join")) {
      const blockedUrl = new URL("/restricted-region", request.url);
      return NextResponse.redirect(blockedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
