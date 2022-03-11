import api from '@utils/justwatch/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(await api.getUrl(req));
}
