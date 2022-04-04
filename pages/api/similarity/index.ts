import { isMovie } from '@utils/helper/tmdb';
import similarity from '@utils/similarity';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type, locale, user } = Object.freeze(req.query);

    res.status(200).json(await similarity.getF(parseInt(id.toString()), isMovie(type) ? 1 : 0, locale.toString(), user.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
