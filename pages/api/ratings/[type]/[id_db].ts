import tmdb from '@utils/tmdb/api';
import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id_db } = req.query as any;

    const item = await api.findOne({ type: ['1', 'movie'].includes(type) ? 1 : 0, id_db: parseInt(id_db) });

    res.status(200).json(
      await tmdb.ratings({
        tmdb: {
          vote_average: item.ratings?.tmdb?.vote_average,
          vote_count: item.ratings?.tmdb?.vote_count,
          isMovie: ['1', 'movie'].includes(type),
          name: item.name.en,
          release_date: item.release_date,
        },
        imdb_id: item.external_ids.imdb_id!,
      })
    );
  } catch ({ message }: any) {
    res.status(500).json(message);
  }
}
