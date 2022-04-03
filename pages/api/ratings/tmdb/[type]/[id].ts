import type { NextApiRequest, NextApiResponse } from 'next';
import ratings from '@utils/apis/ratings';

import { isMovie } from '@utils/helper/tmdb';
import { MovieDbTypeEnum } from '@Types/items';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type } = Object.freeze(req.query);

    res.status(200).json(await ratings.getTmdbRating(parseInt(id.toString()), MovieDbTypeEnum[isMovie(type) ? 'movie' : 'tv']));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
