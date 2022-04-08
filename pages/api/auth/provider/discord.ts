import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import user from '@utils/user';
import history from '@utils/user/history';
import { baseUrl } from '@m2vi/iva';
import { DiscordUser } from '@Types/discord';
import QueryString from 'qs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const scope = ['identify'].join(' ');
    const REDIRECT_URI = `${baseUrl(req)}/api/auth/provider/discord`;

    const OAUTH_QS = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope,
    }).toString();

    const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

    const { code = null, error = null } = req.query;

    if (error) {
      return res.redirect(`/`);
    }

    if (!code || typeof code !== 'string') return res.redirect(OAUTH_URI);

    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
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
      .catch((reason) => {});

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

    let client = null;

    client = await user.find(me.id).catch((reason) => {});

    if (!client) client = await user.create(me.id);
    if ((client as any)?.error) return res.redirect(`/error?${QueryString.stringify({ e: client.error })}`);

    const { sessionId } = await history.insert(me.id, req);

    const token = sign(
      {
        ...me,
        sessionId: sessionId,
        identifier: client.identifier,
        token: client.token,
        created_at: client.created_at,
        history: client.history.slice(0, 5),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '2 weeks' }
    );

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + 86400 * 1000 * 7 * 2),
      })
    );

    res.redirect('/');
  } catch (error) {
    res.redirect('/error?e=Unkown');
  }
}
