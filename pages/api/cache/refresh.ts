import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const keys: Array<keyof typeof cache.config> = Object.keys(cache.config) as any;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    await cache.refresh(key);
  }

  res.status(200).json(true);
}
