import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.json(await api.getTab({ tab: 'anime', start: 0, end: 50, locale: 'en' }));
  } catch (error) {
    res.json((error as any).message);
  }
}
