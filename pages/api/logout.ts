import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.cookies.token) {
    res.setHeader('Set-Cookie', 'jwt=deleted; Max-Age=0; path=/');
    return res.redirect('/');
  }

  res.redirect('/error?error=Cookie was not set');
}
