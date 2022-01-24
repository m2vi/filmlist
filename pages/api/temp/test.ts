import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
<<<<<<< HEAD
  res.json(null);
=======
  res.json(await api.cachedItems());
>>>>>>> parent of c0c0014 (speed. i am speed)
}
