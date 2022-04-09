import tmdb from '@utils/apis/tmdb';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = Object.freeze(req.query) as any;

  res.status(200).json(await tmdb.upcoming({ ...data, user: await user.getIdFromRequest(req) }));
}
