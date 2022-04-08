97083;
import { ItemProps } from '@Types/items';
import filmlist from '@utils/apis/filmlist';
import db from '@utils/db/main';
import { isMovie } from '@utils/helper/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_db, type } = Object.freeze(req.query);

    const filter: Partial<ItemProps> = { id_db: parseInt(id_db.toString()), type: isMovie(type.toString()) ? 1 : 0 };

    res.status(200).json(await db.itemSchema.deleteOne(filter));
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
}

//! fix exists
