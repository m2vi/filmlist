import type { NextApiRequest, NextApiResponse } from 'next';
import { api } from '@utils/tmdb/api';
import { removeDuplicates, sortByKey } from '@utils/array';
import _ from 'underscore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //! strange
  const movieList = (await api.genreMovieList()).genres;
  const tvList = (await api.genreTvList()).genres;

  const entries = sortByKey((movieList ? movieList : []).concat(tvList ? tvList : []), 'name');
  const strings = removeDuplicates(entries.map(({ name }) => name));
  const modified = strings.map((name: string) => _.find(entries, { name }));

  res.status(200).json({ data: modified });
}
