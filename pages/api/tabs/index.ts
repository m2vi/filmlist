import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.json(await api.getTabs());
  } catch (error) {
    res.json((error as any).message);
  }
}
