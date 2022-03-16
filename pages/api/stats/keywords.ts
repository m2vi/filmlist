import { sortByKey } from '@m2vi/iva';
import api from '@utils/backend/api';
import { ItemProps } from '@utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collection = await api.schema.find().select('keywords').lean<ItemProps[]>();
  let keywords = [] as any[];
  collection.forEach((item) => {
    keywords = [...keywords, ...item.keywords];
  });

  let stats = {} as any;

  keywords
    .map(({ name }) => name)
    .forEach((x) => {
      stats[x] = (stats[x] || 0) + 1;
    });

  const result = Object.entries(stats).map(([name, count]) => ({ name, count }));

  return res.status(200).json(sortByKey(sortByKey(result, 'name').reverse(), 'count').reverse());
}
