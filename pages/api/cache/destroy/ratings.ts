import ratings from '@utils/backend/ratings';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await ratings.getAll(true);

  res.status(200).json({});
}
