import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jsonResponse } from '@utils/fetch';
import api from '@utils/worker/worker';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (process.env.NODE_ENV !== 'development') {
    return jsonResponse(425, {
      error: 'This route is currently being maintained ',
    });
  }

  if (!req.page.name) return;

  const [result, error] = await api.verify(req);

  if (!result) {
    return jsonResponse(401, {
      error: 'Unauthorized',
    });
  }

  return NextResponse.next();
}
