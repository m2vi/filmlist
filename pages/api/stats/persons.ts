import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await api.getPersons('en', 0, Number.MAX_SAFE_INTEGER));
}
