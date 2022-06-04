import main from '@apis/main';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id_db, type } = Object.freeze(req.query);

    const data = await main.insert(id_db.toString(), type.toString());

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
}
