import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tab, locale, start, end, includeGenres } = req.query as any;

  res.status(200).json(await api.getTab({ tab, locale, start, end, includeGenres: includeGenres ? parseInt(includeGenres) : undefined }));
}
