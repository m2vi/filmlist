import { GetServerSidePropsContext } from 'next';
import { DiscordUser } from './types';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import * as config from './config';

export function parseUser(ctx: GetServerSidePropsContext): DiscordUser | null {
  if (!ctx.req.headers.cookie) {
    return null;
  }

  const token = parse(ctx.req.headers.cookie)[config.oauth.cookieName];

  if (!token) {
    return null;
  }

  try {
    const { iat, exp, ...user } = verify(token, config.oauth.jwtSecret) as DiscordUser & { iat: number; exp: number };
    return user;
  } catch (e) {
    return null;
  }
}
