import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type, state } = req.query as any;

  res.status(200).json(await api.insert({ id_db: parseInt(id), type, state: parseInt(state) }));
}
