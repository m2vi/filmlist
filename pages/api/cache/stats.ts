import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json((await cache.items.get()).slice(0, 50));
}
