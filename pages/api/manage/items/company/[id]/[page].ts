import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, locale, page, type = 'movie' } = req.query as any;

  const items = await api.getCompanyItems({ id: parseInt(id), locale, page: parseInt(page), type });

  res.status(200).json({
    name: parseInt(id),
    route: null,
    items: items,
    length: items.length,
  });
}
