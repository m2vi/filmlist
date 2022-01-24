import itemSchema from '@models/itemSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await itemSchema.find({}).select('_id id_db type').lean();

  for (const index in docs) {
    const { _id, id_db, type } = docs[index];

    try {
      await itemSchema.updateOne(
        { id_db, type },
        {
          index: parseInt(index),
        }
      );
    } catch (error: any) {
      console.log(`ERROR - ${_id?.toString()} - ${error.message}`);
    }
  }

  res.json({
    success: true,
  });
}
