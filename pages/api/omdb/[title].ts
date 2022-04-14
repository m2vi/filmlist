import type { NextApiRequest, NextApiResponse } from 'next';
import ratings from '@utils/apis/ratings';
import omdb from '@utils/apis/omdb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title } = Object.freeze(req.query);

    res.status(200).json(await omdb.getByTitle(title.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
