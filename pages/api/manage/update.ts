import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { performance } from 'perf_hooks';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const length = docs.length;
  let modified = 0;
  let modifiedIds = [];
  let updated = 0;
  let errors = [];

  for (const index in docs) {
    const { _id, id_db, type, original_name } = docs[index];
    const start = performance.now();

    try {
      const n: any = await client.dataForUpdate(id_db, type);
      const result = await itemSchema.updateOne(
        { id_db, type },
        {
          ...n,
        }
      );
      modified += result.modifiedCount;
      result.modifiedCount && modifiedIds.push(original_name);
      updated += 1;
    } catch (error: any) {
      errors.push({
        message: `ERROR - ${_id?.toString()} - ${error.message}`,
      });
      console.log(`ERROR - ${_id?.toString()} - ${error.message}`);
    }

    const end = performance.now() - start;

    console.log(`${((100 * (parseInt(index) + 1)) / length).toFixed(2)}% - ${end.toFixed(2)}ms - ${_id?.toString()} - ${id_db}`);
  }

  res.json({
    updated,
    modified: {
      count: modified,
      modifiedIds,
    },
  });
}
