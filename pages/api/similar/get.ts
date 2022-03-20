import api from '@utils/backend/api';
import helper from '@utils/helper/main';
import similarity from '@utils/similarity';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_db, type, locale = 'en' } = Object.freeze(req.query) as any;

    const data = await similarity.get(parseInt(id_db), helper.isMovie(type) ? 1 : 0);

    const items = api.prepareForFrontend(data, locale).slice(0, 20);

    res.status(200).json({
      name: '',
      route: null,
      items,
      length: items.length,
    });
  } catch (error) {
    res.status(500).json([]);
  }
}
