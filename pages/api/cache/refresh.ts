import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cache.items.refresh();
  cache.tabs.refresh();

  res.status(200).json(true);
}
