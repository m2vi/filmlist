import api from '@utils/backend/api';
import { ItemProps } from '@utils/types';
import { isReleased } from '@utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import _, { Iteratee } from 'underscore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const items = await api.find({ favoured: true, watched: false });
  const filter = (iteratee?: Iteratee<ItemProps[], boolean>) => _.filter(items);

  const favouredButNotWatched = filter({ favoured: true, watched: false });
  const watchedButNotReleased = filter({ watched: true }).filter(({ release_date }) => !isReleased(release_date));
  const hallOfFameButNotFavoured = filter({ hall_of_fame: true, favoured: false });

  res.status(200).json({ favouredButNotWatched, watchedButNotReleased, hallOfFameButNotFavoured });
}
