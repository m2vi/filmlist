import { basicFetch } from '@utils/helper/fetch';
import QueryString from 'qs';

export class Omdb {
  constructor(private baseUrl = 'https://www.omdbapi.com/', private apiKey = 'daf5c972') {}

  async getBase(title: string, type: number) {
    const qs = QueryString.stringify({ apikey: this.apiKey, t: title, type: type ? 'movie' : 'series' });
    const data = await basicFetch(`${this.baseUrl}?${qs}`);

    return data;
  }

  async getExternalRatings(title: string, type: number, base?: any) {
    base = base ? base : await this.getBase(title, type);

    const rottentomatoes = base?.Ratings?.find((item: any) => item?.Source === 'Rotten Tomatoes');
    const metascore = base?.Metascore ? parseInt(base?.Metascore) / 10 : null;

    return {
      imdb: {
        vote_average: base?.imdbRating ? parseFloat(base?.imdbRating) : null,
        vote_count: base?.imdbVotes ? parseFloat(base?.imdbVotes?.replace(/,/g, '')) : null,
      },
      rottentomatoes: {
        vote_average: rottentomatoes ? parseFloat(rottentomatoes?.Value) / 10 : null,
        vote_count: null,
      },
      metacritic: {
        vote_average: Number.isNaN(metascore as any) ? null : metascore,
        vote_count: null,
      },
    };
  }
}

export const omdb = new Omdb();
export default omdb;
