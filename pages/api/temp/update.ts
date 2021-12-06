import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const results: any[] = [];

  docs.map(({ name, original_name, type }) => {
    if (type === 0) return;
    if (original_name !== name.en) {
      results.push({
        name: name.en,
        original_name,
      });
    }
  });

  res.json(results);
}
