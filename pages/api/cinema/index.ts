import tmdb from '@apis/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await tmdb.api.upcomingMovies({ region: 'at', language: 'de' }));
}
