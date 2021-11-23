import type { NextApiRequest, NextApiResponse } from 'next';
import _ from 'underscore';
import api from '@utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await api.stats());
}
