import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import api from '@utils/worker/worker';
import { jsonResponse } from '@utils/fetch';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) return;

  const [result, error] = await api.verify(req);

  if (!result) {
    return jsonResponse(401, {
      error: 'Unauthorized',
    });
  }

  return NextResponse.next();
}
