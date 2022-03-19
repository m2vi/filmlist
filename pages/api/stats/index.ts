import type { NextApiRequest, NextApiResponse } from 'next';
import stats from '@utils/backend/statistics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await stats.stats());
}
