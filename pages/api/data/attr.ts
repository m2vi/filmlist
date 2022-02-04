import itemSchema from '@models/itemSchema';
import { removeDuplicates, sortByKey } from '@utils/array';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { attr } = Object.freeze(req.query);
  const data = (await itemSchema.find().select(attr.toString()).lean()).map((item) => item?.[attr.toString()]);

  res.status(200).json({ data: sortByKey(removeDuplicates(data), '') });
}
