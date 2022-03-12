import tmdb from '@utils/tmdb/api';
import api from '@utils/backend/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { MovieDbTypeEnum } from '@utils/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, id_db } = req.query as any;

    const params = {
      id: id_db,
      lanuage: 'en-GB',
      append_to_response: 'external_ids',
    };

    const isMovie = (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
    const data: any = await (isMovie ? tmdb.api.movieInfo(params) : tmdb.api.tvInfo(params));

    res.status(200).json(
      await tmdb.ratings({
        tmdb: {
          vote_average: data.vote_average,
          vote_count: data.vote_count,
          isMovie: isMovie,
          name: data.title ? data.title : data.name,
          release_date: new Date(isMovie ? data.release_date : data.first_air_date).getTime(),
        },
        imdb_id: data.external_ids.imdb_id!,
      })
    );
  } catch ({ message }: any) {
    res.status(500).json(message);
  }
}
