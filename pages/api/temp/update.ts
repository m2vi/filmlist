import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(
    await api.updateMany(
      {},
      {
        $unset: {
          tagline: '',
          vote_average: '',
          vote_count: '',
        },
      }
    )
  );
}
