import client from '@utils/themoviedb/api';
import { stringToBoolean } from '@utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { isMovie, id, locale } = req.query as any;

  res.status(200).json(await client.getRecommendations(stringToBoolean(isMovie), { id: parseInt(id) }, locale));
}
