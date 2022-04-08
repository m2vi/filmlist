import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db.init();

  const ratings = await db.ratingSchema.find().lean<any[]>();

  function decodeIdentifier(id: string) {
    const author = Buffer.from(id.split('.')[0], 'base64url').toString('utf8');
    const timestamp = Buffer.from(id.split('.')[1], 'base64url').toString('utf8');

    return {
      author,
      timestamp: parseInt(timestamp),
    };
  }

  res.json(ratings.map(({ identifier, filter, rating }) => ({ identifier, author: decodeIdentifier(identifier).author, filter, rating })));
  await db.ratingSchema.deleteMany();
}
