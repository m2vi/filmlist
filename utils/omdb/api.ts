import { basicFetch } from '@utils/fetch';
import { stringToBoolean } from '@utils/utils';
import client from '@utils/tmdb/api';
import QueryString from 'qs';

export class Api {
  constructor(private baseUrl = 'https://www.omdbapi.com/') {}

  private async raw(type: string, id_db: string) {
    try {
      const tmdb = await client.adapt(parseInt(id_db), type as any);

      return {
        tmdb: tmdb,
        omdb: await basicFetch(
          `${this.baseUrl}?apikey=${'daf5c972'}&i=${encodeURIComponent(tmdb.external_ids?.imdb_id!)}&type=${
            type === 'movie' || type.toString() === '1' ? 'movie' : 'series'
          }`
        ),
      };
    } catch (error) {
      return null;
    }
  }

  async getIMDB(title: string, type: number) {
    const qs = QueryString.stringify({ apikey: 'daf5c972', t: title, type: type ? 'movie' : 'series' });

    const data = await basicFetch(`${this.baseUrl}?${qs}`);

    return {
      vote_average: data?.imdbRating ? parseFloat(data?.imdbRating) : null,
      vote_count: data?.imdbVotes ? parseFloat(data?.imdbVotes?.replace(/,/g, '')) : null,
    };
  }

  async ratings(type: string, id_db: string, raw: string) {
    const data = await this.raw(type, id_db);
    if (!data) return null;
    if (raw && stringToBoolean(raw)) return data;

    return {
      imdb: {
        vote_average: data?.omdb?.imdbRating ? parseFloat(data?.omdb?.imdbRating) : null,
        vote_count: data?.omdb?.imdbVotes ? parseFloat(data?.omdb?.imdbVotes?.replace(/,/g, '')) : null,
      },
      tmdb: {
        vote_average: data?.tmdb?.ratings?.tmdb?.vote_average ? data?.tmdb?.ratings?.tmdb?.vote_average : null,
        vote_count: data?.tmdb?.ratings?.tmdb?.vote_count ? data?.tmdb?.ratings?.tmdb?.vote_count : null,
      },
    };
  }
}

export const api = new Api();
export default api;
