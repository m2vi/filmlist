import type { NextFetchEvent, NextRequest } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (process.env.NODE_ENV === 'development') {
    return new Response(req.ip);
  } else {
  }
}
