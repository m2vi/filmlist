import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';
import moment from 'moment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('content-disposition', `attachment; filename=${moment().format('YYYY-MM-DD')}.json`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).json(await api.backup());
}
