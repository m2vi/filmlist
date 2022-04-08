import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import api from './verify';
import data from '@data/middleware.json';
import { ErrorResponse } from './helper';

export async function restricted(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) return;

  if (!data.restricted.includes(req.page.name)) return;

  const [result, error] = await api.verify(req, true);

  if (!result) {
    return NextResponse.redirect(`${req.nextUrl.origin}/oauth/discord`);
  }

  return NextResponse.next();
}

export async function open(req: NextRequest, ev: NextFetchEvent) {
  return NextResponse.next();
}

export async function closedApi(req: NextRequest, ev: NextFetchEvent) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  return ErrorResponse(401, 'Forbidden');
}

//? json response
export async function restrictedApi(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) return;

  const [result, error] = await api.verify(req, true);

  if (!result) {
    return ErrorResponse(401, 'Not authorised');
  }

  return NextResponse.next();
}
