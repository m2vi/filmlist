import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = user.getIdFromRequest(req);

  res.status(200).json(await user.setItem(id, { filter: { id: 359940, type: 1 }, index: 0, rating: 8.3, state: 2 }, true));
}
