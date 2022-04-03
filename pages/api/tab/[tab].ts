import filmlist from '@utils/apis/filmlist';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = Object.freeze(req.query) as any;

  res.status(200).json(await filmlist.getTab(data));
}
