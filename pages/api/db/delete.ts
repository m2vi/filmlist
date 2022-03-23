import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';
import helper from '@utils/helper/main';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type } = req.query as any;

  res.status(200).json(await api.deleteOne({ id_db: parseInt(id), type: helper.isMovie(type) ? 1 : 0 }));
}
