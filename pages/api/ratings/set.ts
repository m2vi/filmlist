import api from '@utils/backend/api';
import ratings from '@utils/backend/ratings';
import helper from '@utils/helper/main';
import user from '@utils/user/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_db, type, rating } = Object.freeze(req.query) as any;
  const author = user.id(req);

  if (!helper.isValidId(id_db) || !helper.isValidType(type)) {
    return res.status(400).json({ error: 'Bad request' });
  }
  const result = await ratings.set({
    author: author?.toString()!,
    filter: { id_db: parseInt(id_db), type: helper.isMovie(type) ? 1 : 0 },
    rating: parseFloat(rating),
  });

  res.status(200).json(result);
}
