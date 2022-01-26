import itemSchema from '@models/itemSchema';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await itemSchema.find().select('_id').lean();

  for (const index in docs) {
    const { _id } = docs[index];
    console.clear();
    console.log(`${parseInt(index) + 1}/${docs.length}`);
    try {
      await itemSchema.updateOne(
        { _id },
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
