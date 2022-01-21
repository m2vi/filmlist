import api from '@utils/justwatch/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).redirect(await api.getUrl(req));
}
