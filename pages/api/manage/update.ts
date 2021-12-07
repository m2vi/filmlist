import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const length = docs.length;
  let modified = 0;
  let updated = 0;
  let errors = [];

  for (const index in docs) {
    try {
      const { id_db, type } = docs[index];
      console.log(id_db, `${parseInt(index) + 1}/${length}`);
      const n: any = await client.dataForUpdate(id_db, type);
      const result = await itemSchema.updateOne(
        { id_db, type },
        {
          ...n,
        }
      );
      modified += result.modifiedCount;
      updated += 1;
    } catch (error) {
      errors.push(index);
    }
  }

  res.json({
    errors,
    modified,
  });
}
