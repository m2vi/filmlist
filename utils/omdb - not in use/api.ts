import { basicFetch } from '@utils/fetch';

export class Api {
  constructor(private baseUrl = 'https://www.omdbapi.com/') {}

  private async raw(imdb_id: string) {
    try {
      return await basicFetch(`${this.baseUrl}?apikey=${'daf5c972'}&i=${encodeURIComponent(imdb_id)}`);
    } catch (error) {
      return null;
    }
  }

  async ratings(reponse: any) {
    if (!reponse?.external_ids?.imdb_id)
      return {
        imdb: {
          vote_average: null,
          vote_count: null,
        },
        rotten_tomatoes: {
          vote_average: null,
          vote_count: null,
        },
        tmdb: {
          vote_average: reponse.vote_average ? reponse.vote_average : null,
          vote_count: reponse.vote_count ? reponse.vote_count : null,
        },
      };
    const data = await this.raw(reponse.external_ids.imdb_id);
    if (!data) return null;

    const rotten = data?.Ratings?.find(({ Source }: any) => Source === 'Rotten Tomatoes')?.Value;

    return {
      imdb: {
        vote_average: data?.imdbRating ? parseInt(data?.imdbRating) : null,
        vote_count: data?.imdbVotes ? parseInt(data?.imdbVotes?.replace(/,/g, '')) : null,
      },
      rotten_tomatoes: {
        vote_average: parseInt(rotten) ? parseInt(rotten) / 10 : null,
        vote_count: null,
      },
      tmdb: {
        vote_average: reponse.vote_average ? reponse.vote_average : null,
        vote_count: reponse.vote_count ? reponse.vote_count : null,
      },
    };
  }
}

export const api = new Api();
export default api;
