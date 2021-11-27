import { client } from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type } = req.query;

    res.json(await client.get(parseInt(id as string), type as any, {}));
  } catch (error) {}
}
