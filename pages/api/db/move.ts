import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { position, filter } = req.query;

    res.status(200).json(await api.moveItemToStart(JSON.parse(filter.toString())));
  } catch ({ message }: any) {
    res.status(500).json({ error: message });
  }
}
