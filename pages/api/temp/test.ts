import api from '@utils/backend/api';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import _ from 'underscore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const items = await api.schema
    .find({
      state: {
        $gt: 0,
      },
    })
    .select(['runtime', 'number_of_episodes', 'number_of_seasons', 'type'])
    .lean();

  const movies = _.filter(items, { type: 1 }).reduce((prev, curr) => {
    return prev + curr.runtime;
  }, 0);
  const shows = _.filter(items, { type: 0 }).reduce((prev, curr) => {
    return prev + curr.runtime * (curr?.number_of_episodes ? curr?.number_of_episodes : 0);
  }, 0);

  res.json({
    movies: moment.duration(movies, 'minutes').format('H [Hours]'),
    'tv shows': moment.duration(shows, 'minutes').format('H [Hours]'),
  });
}
