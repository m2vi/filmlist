import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import * as config from '@utils/worker/config';
import api from '@utils/worker/worker';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name || !config.middleware.restricted.includes(req.page.name)) return;

  const [result, error] = await api.verify(req, true);

  if (!result) {
    return NextResponse.redirect(`/oauth?e=${encodeURIComponent(error)}`);
  }

  return NextResponse.next();
  //  .cookie("geo", JSON.stringify({}))
}
