import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0; path=/');

  res.status(200).redirect('/');
}
