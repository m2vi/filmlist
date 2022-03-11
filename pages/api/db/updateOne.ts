import itemSchema from '@models/itemSchema';
import client from '@utils/tmdb/api';
import { MovieDbTypeEnum } from '@utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as any;
  const id_db = parseInt(query.id_db.toString());
  const type = (MovieDbTypeEnum[query.type.toString()] as any) === MovieDbTypeEnum.movie || query.type.toString() === '1' ? 1 : 0;

  const n: any = await client.dataForUpdate(id_db, type);
  const result = await itemSchema.updateOne(
    { id_db, type },
    {
      ...n,
    }
  );

  res.status(200).json(result);
}
