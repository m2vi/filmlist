import watchtime from '@utils/backend/watch_time';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(await watchtime.get());
}
