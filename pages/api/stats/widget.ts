import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await api.widget());
}
