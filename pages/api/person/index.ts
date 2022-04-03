import filmlist from '@utils/apis/filmlist';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page } = Object.freeze(req.query);

    const data = await filmlist.persons(parseInt(page.toString()));

    res.status(200).json(data);
  } catch (error) {
    res.status(200).json([]);
  }
}
