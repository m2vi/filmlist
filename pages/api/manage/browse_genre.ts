import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locale, seed, index } = Object.freeze(req.query) as any;

  const data = await api.getBrowseGenre({ locale, seed, index: parseInt(index) });
  res.status(200).json(data);
}
