import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jsonResponse } from '@utils/fetch';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (process.env.NODE_ENV !== 'development') {
    return jsonResponse(423, {
      error: 'This route is for development purposes only.',
    });
  }

  return NextResponse.next();
}
