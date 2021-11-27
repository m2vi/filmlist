import { client } from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.json(await client.getTabs());
  } catch (error) {
    res.json((error as any).message);
  }
}
