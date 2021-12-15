import { serialize } from 'cookie';
import { oauth } from '../../utils/config';
import { sign } from 'jsonwebtoken';
import { DiscordUser } from '../../utils/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { baseUrl } from '@utils/fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const scope = ['identify'].join(' ');
    const REDIRECT_URI = `${baseUrl(req)}/api/oauth`;

    const OAUTH_QS = new URLSearchParams({
      client_id: oauth.clientId,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope,
    }).toString();

    const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

    const { code = null, error = null } = req.query;

    if (error) {
      return res.redirect(`/error/?e=${encodeURIComponent(req.query.error as any)}`);
    }

    if (!code || typeof code !== 'string') return res.redirect(OAUTH_URI);

    const body = new URLSearchParams({
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code,
      scope,
    }).toString();

    const { access_token = null, token_type = 'Bearer' } = await fetch('https://discord.com/api/oauth2/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body,
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    if (!access_token || typeof access_token !== 'string') {
      return res.redirect(OAUTH_URI);
    }

    const me: DiscordUser | { unauthorized: true } = await (
      await fetch('http://discord.com/api/users/@me', {
        headers: { Authorization: `${token_type} ${access_token}` },
      })
    ).json();

    if (!('id' in me)) {
      return res.redirect(OAUTH_URI);
    }

    if (!oauth.allowedIDs.includes(me.id)) {
      return res.redirect('/oauth?e=Not allowed');
    }

    const token = sign(me, oauth.jwtSecret, { expiresIn: '24h' });

    res.setHeader(
      'Set-Cookie',
      serialize(oauth.cookieName, token, {
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
      })
    );

    res.redirect('/');
  } catch (error) {
    res.redirect('/error?e=Unkown');
  }
}

// https://alistair.blog/post/serverless-oauth
