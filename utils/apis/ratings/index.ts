import { RatingsResponse } from '@Types/filmlist';
import { MovieDbTypeEnum, VoteProps } from '@Types/items';
import * as RtTypes from '@Types/rt';
import { UserItem, UserProps } from '@Types/user';
import db from '@utils/db/main';
import { isMovie } from '@utils/helper/tmdb';
import { IdAppendToResponseRequest, MovieResponse, ShowResponse } from 'moviedb-promise/dist/request-types';
import { Movie, Series } from 'vimdb';
import imdb from '../imdb';
import omdb from '../omdb';
import rt from '../rt';
import tmdb from '../tmdb';

class Ratings {
  async getUserRating(id: number, type: MovieDbTypeEnum): Promise<VoteProps> {
    const filter = { id, type: isMovie(type) ? 1 : 0 };

    await db.init();
    const items = await db.userSchema
      .find({ identifier: { $ne: null } })
      .select('items')
      .lean<UserProps[]>();

    const all = items.reduce((prev, curr) => prev.concat(curr.items), [] as UserItem[]);

    const ratings = all.filter((item) => item.filter.id === filter.id && item.filter.type === filter.type).map(({ rating }) => rating);

    const length = ratings.filter((rating) => rating !== null).length;
    const sum = ratings.filter((rating) => rating !== null).reduce((prev, curr) => prev! + curr!, 0);

    return {
      vote_average: parseFloat((sum! / length).toFixed(1)),
      vote_count: length,
    };
  }

  async getTmdbRating(params: string | number | IdAppendToResponseRequest, type: MovieDbTypeEnum): Promise<VoteProps> {
    const result = await tmdb.get(params, type);

    return {
      vote_average: result.vote_average ? result.vote_average : null,
      vote_count: result.vote_count ? result.vote_count : null,
    };
  }

  async getImdbRating(id: string): Promise<VoteProps> {
    const result = await imdb.get(id);

    return {
      vote_average: result?.aggregateRating.ratingValue ? result.aggregateRating.ratingValue : null,
      vote_count: result?.aggregateRating.ratingCount ? result.aggregateRating.ratingCount : null,
    };
  }

  async getRtRating({ name, type, year }: RtTypes.FindBase): Promise<VoteProps> {
    const result = await rt.find({ name, type, year });
    result?.meterScore, result?.meterClass;
    return {
      vote_average: result?.meterScore ? result?.meterScore / 10 : null,
      vote_count: null,
      vote_class: result?.meterClass ? result?.meterClass : null,
    };
  }

  getRatingsFromBase(
    tmdb: MovieResponse | ShowResponse,
    imdb: Movie | Series | null,
    rt: RtTypes.MovieResponse | RtTypes.TVSeriesResponse | null
  ): RatingsResponse {
    return {
      tmdb: {
        vote_average: tmdb.vote_average ? tmdb.vote_average : null,
        vote_count: tmdb.vote_count ? tmdb.vote_count : null,
      },
      imdb: {
        vote_average: imdb?.aggregateRating.ratingValue ? imdb.aggregateRating.ratingValue : null,
        vote_count: imdb?.aggregateRating.ratingCount ? imdb.aggregateRating.ratingCount : null,
      },
      rt: {
        vote_average: rt?.meterScore ? rt?.meterScore / 10 : null,
        vote_count: null,
        vote_class: rt?.meterClass ? rt?.meterClass : null,
      },
    };
  }

  async getMetacriticRating(id: string): Promise<VoteProps> {
    const data = await omdb.getById(id);

    return {
      vote_average: data?.Metascore ? parseInt(data?.Metascore) / 10 : null,
      vote_count: null,
    };
  }

  async get(id: number, type: MovieDbTypeEnum): Promise<RatingsResponse> {
    const item = (await tmdb.get({ id, append_to_response: 'external_ids' }, type)) as any;
    const [imdb, rt, user_rating, metacritic] = await Promise.all([
      this.getImdbRating(item?.external_ids?.imdb_id),
      this.getRtRating({
        name: item.title ? item.title : item.name,
        type,
        year: new Date(item?.first_air_date ? item?.first_air_date : item?.release_date).getFullYear(),
      }),
      this.getUserRating(id, type),
      this.getMetacriticRating(item?.external_ids?.imdb_id),
    ]);

    return {
      tmdb: {
        vote_average: item.vote_average ? item.vote_average : null,
        vote_count: item.vote_count ? item.vote_count : null,
      },
      imdb,
      rt,
      metacritic,
      user: user_rating,
    };
  }
}

export const ratings = new Ratings();
export default new Ratings();
