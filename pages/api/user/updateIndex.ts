import user from '@apis/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = user.getIdFromRequest(req);

  res.json(await user.updateIndex(id));
}
