import { sortByKey } from '@utils/array';
import api from '@utils/backend/api';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const items = await api.schema
    .find({
      state: {
        $gt: 0,
      },
      genre_ids: {
        $nin: [10767],
      },
    })
    .select(['runtime', 'number_of_episodes', 'number_of_seasons', 'ratings.tmdb.vote_count', 'type', 'name'])
    .lean();

  const result = sortByKey(
    items
      .map(({ runtime, number_of_episodes, number_of_seasons, type, name, ratings }) => {
        if (type || ratings?.tmdb?.vote_count! < 50) {
          return null;
        } else {
          return {
            name: name?.de,
            raw: runtime * (number_of_episodes && number_of_episodes < 500 ? number_of_episodes : 1),
            runtime: moment
              .duration(runtime * (number_of_episodes && number_of_episodes < 500 ? number_of_episodes : 1), 'minutes')
              .format('H [Hours]'),
          };
        }
      })
      .filter((v) => v),
    'raw'
  ).reverse();

  res.status(200).json(result);
}
