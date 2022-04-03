import { MovieDbTypeEnum } from '@Types/items';
import tmdb from '@utils/apis/tmdb';
import { isMovie } from '@utils/helper/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type, locale, user } = Object.freeze(req.query);

    res.status(200).json(
      await tmdb.getRecommendations({
        user: user.toString(),
        id: parseInt(id.toString()),
        type: MovieDbTypeEnum[isMovie(type) ? 'movie' : 'tv'],
        locale: locale.toString(),
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
