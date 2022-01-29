import api from '@utils/omdb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id_db } = req.query as any;

    res.status(200).json(await api.ratings(type.toString(), id_db.toString()));
  } catch ({ message }: any) {
    res.status(500).json(message);
  }
}
