import { removeDuplicates } from '@utils/array';
import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await api.schema.find().select('state').lean();
  const arr = removeDuplicates(data.map(({ state }) => state));
  res.json(arr);
}
