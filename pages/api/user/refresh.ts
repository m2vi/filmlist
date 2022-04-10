import cache from '@utils/apis/cache';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json((await cache.user.refresh(user.getIdFromRequest(req))).identifier);
}
