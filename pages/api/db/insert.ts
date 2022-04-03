import filmlist from '@utils/apis/filmlist';
import db from '@utils/db/main';
import { isMovie } from '@utils/helper/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_db, type } = Object.freeze(req.query);

    const data = await filmlist.get(parseInt(id_db.toString()), isMovie(type.toString()) ? 1 : 0);

    const doc = new db.itemSchema(data);
    const result = await doc.save();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
}

//! fix exists
