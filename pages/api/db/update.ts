import api from '@utils/backend/api';
import client from '@utils/tmdb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await api.update(parseInt(req.query.id.toString()), client.isMovie(req.query.type.toString()) ? 1 : 0);
    await api.updateCache();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: false, error: (error as Error).message });
  }
}
