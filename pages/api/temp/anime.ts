import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(
    await api.updateMany(
      {
        original_language: 'ja',
        genre_ids: {
          $in: [16],
          $nin: [7424],
        },
      },
      {
        // $pull: { genre_ids: 7424 },
        $push: { genre_ids: { $each: [7424], $position: 0 } },
      }
    )
  );
}
