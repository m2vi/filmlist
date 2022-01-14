import api from '@utils/piracy/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type } = Object.freeze(req.query) as any;
  res.status(200).json(await api.getData(id, type));
}
