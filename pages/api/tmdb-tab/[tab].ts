import filmlist from '@utils/apis/filmlist';
import tmdb from '@utils/apis/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = Object.freeze(req.query) as any;

  res.status(200).json(await tmdb.getTab(data));
}
