import itemSchema from '@models/itemSchema';
import { removeDuplicates, sortByKey } from '@utils/array';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const certificates = (await itemSchema.find().select('rated').lean()).map(({ rated }) => rated);

  res.status(200).json({ data: sortByKey(removeDuplicates(certificates), '') });
}
