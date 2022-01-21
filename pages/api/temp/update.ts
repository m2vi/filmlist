import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(await api.updateMany({ id_db: { $in: [] } }, { state: 1 }));
}
