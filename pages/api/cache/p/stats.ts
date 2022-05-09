import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stats = await cache.stats();

  res.status(200).json(stats.split('connected_clients:')[1].split('\n')[0].trim());
}
