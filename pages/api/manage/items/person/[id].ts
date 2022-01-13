import client from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, locale } = req.query as any;

  const tab = await client.getPersonItems(parseInt(id), locale);

  res.status(200).json({
    route: null,
    ...tab,
  });
}
