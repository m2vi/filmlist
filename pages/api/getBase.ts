import { MovieDbTypeEnum } from '@Types/items';
import filmlist from '@utils/apis/filmlist';
import { isMovie } from '@utils/helper/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type } = Object.freeze(req.query);

    res.status(200).json(await filmlist.getBase(parseInt(id.toString()), MovieDbTypeEnum[isMovie(type) ? 'movie' : 'tv']));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
