import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import api from './verify';
import data from '@data/middleware.json';

export async function restricted(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) return;
  console.log(req.page.name);
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

export async function closed(req: NextRequest, ev: NextFetchEvent) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  return NextResponse.redirect(`${req.nextUrl.origin}/oauth/discord`);
}

//? json response
export async function restrictedApi(req: NextRequest, ev: NextFetchEvent) {
  if (!req.page.name) return;

  if (!data.restricted.includes(req.page.name)) return;

  const [result, error] = await api.verify(req, true);

  if (!result) {
    return NextResponse.redirect(`${req.nextUrl.origin}/oauth/discord`);
  }

  return NextResponse.next();
}
