import type { NextApiRequest, NextApiResponse } from 'next';
import ratings from '@utils/apis/ratings';
import { MovieDbTypeEnum } from '@Types/items';
import { isMovie } from '@utils/helper/tmdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, type, year } = Object.freeze(req.query);

    res
      .status(200)
      .json(
        await ratings.getRtRating({
          name: name.toString(),
          type: MovieDbTypeEnum[isMovie(type) ? 'movie' : 'tv'],
          year: parseInt(year.toString()),
        })
      );
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
