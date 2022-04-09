import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(await cache.production_companies.get());
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
