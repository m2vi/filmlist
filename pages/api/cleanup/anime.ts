import cleanup from '@utils/backend/cleanup';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(await cleanup.anime(true));
}
