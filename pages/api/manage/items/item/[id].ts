import client from '@utils/tmdb/api';
import { stringToBoolean } from '@utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isMovie, id, locale } = req.query as any;

  const items = await client.getRecommendations(stringToBoolean(isMovie), { id: parseInt(id) }, locale);

  res.status(200).json({
    name: '',
    route: null,
    items,
    length: items.length,
  });
}
