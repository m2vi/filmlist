import cache from '@utils/apis/cache';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cache.items.refresh();
  await cache.items_f.refresh();
  await cache.items_m.refresh();
  await cache.persons.refresh();
  await cache.genres.refresh();
  await cache.production_companies.refresh();
  await cache.providers.refresh();
  cache.tabs.refresh();

  res.status(200).json(true);
}
