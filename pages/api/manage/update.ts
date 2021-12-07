import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const length = docs.length;
  let results = [];

  for (const index in docs) {
    try {
      const { id_db, type } = docs[index];
      console.log(id_db, `${parseInt(index) + 1}/${length}`);
      const n: any = await client.dataForUpdate(id_db, type);

      await itemSchema.updateOne(
        { id_db, type },
        {
          ...n,
        }
      );
    } catch (error) {
      results.push(index);
    }
  }

  res.json(results);
}
