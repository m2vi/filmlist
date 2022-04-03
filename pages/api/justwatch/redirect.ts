import api from '@utils/apis/justwatch';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = await api.getUrl(req);

  if (typeof url === 'string') {
    res.redirect(url);
  } else {
    res.status(500).json(url);
  }
}
