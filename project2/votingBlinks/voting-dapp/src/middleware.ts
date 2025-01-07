import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  console.log("✅ Middleware running for:", req.url);

  // Create a response with universal CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

  return response;
}

export const config = {
  matcher: '*', // Apply middleware only to API routes
};
