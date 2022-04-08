import filmlist from '@utils/apis/filmlist';
import { isMovie } from '@utils/helper/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_db, type } = Object.freeze(req.query);

    res.status(200).json(await filmlist.update(parseInt(id_db.toString()), isMovie(type.toString()) ? 1 : 0));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
