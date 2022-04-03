import tmdb from '@utils/apis/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await tmdb.whenisthenextmcufilm('de'));
}
