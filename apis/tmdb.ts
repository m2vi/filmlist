import { isMovie } from '@helper/main';
import { removeEmpty } from '@m2vi/iva';
import { GetTabResponse, MovieDbTypeEnum } from '@Types/items';
import { GetRecommendations, TmdbGetTab, TmdbGetTrending, TmdbGetUpcoming } from '@Types/tmdb';
import _ from 'lodash';
import { MovieDb } from 'moviedb-promise';
import {
  CollectionRequest,
  DiscoverMovieRequest,
  DiscoverTvRequest,
  IdAppendToResponseRequest,
  IdRequestParams,
  UpcomingMoviesRequest,
} from 'moviedb-promise/dist/request-types';
import convert from './convert';
import user from './user';

class Tmdb {
  api: MovieDb;
  constructor() {
    this.api = new MovieDb(process.env.TMDB_TOKEN!);
  }

  async get(params: string | number | IdAppendToResponseRequest, type: MovieDbTypeEnum) {
    return await (isMovie(type) ? this.api.movieInfo(params) : this.api.tvInfo(params));
  }

  async getPerson(params: string | number | IdAppendToResponseRequest) {
    return await this.api.personInfo(params);
  }

  async getCompany(params: string | number | IdRequestParams) {
    return await this.api.companyInfo(params);
  }

  async getCollection(params: string | number | CollectionRequest) {
    return await this.api.collectionInfo(params);
  }

  async getTab({ user: user_id, tab, type, locale, page }: TmdbGetTab): Promise<GetTabResponse> {
    let params = { language: locale, page } as DiscoverMovieRequest | DiscoverTvRequest;

    switch (tab) {
      case 'top-rated':
        params = { language: locale, 'vote_count.gte': 500, sort_by: 'vote_average.desc', page };
        break;
      case 'popular':
        params = { language: locale, sort_by: 'popularity.desc', page };
        break;

      case 'all-time-popular':
        params = { language: locale, sort_by: 'vote_count.desc', page };
        break;
      case 'trending':
        return this.getTrending({ user: user_id, media_type: 'all', time_window: 'day', language: locale });
    }

    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;

    const raw_items = await (isMovie(type) ? this.api.discoverMovie(params as any) : this.api.discoverTv(params));
    const items = user.appendUserAttributes(convert.prepareTmdbForFrontend(raw_items?.results!), client);

    return {
      tmdb: true,
      key: tab,
      length: items.length,
      items: items,
      query: removeEmpty({
        tab,
        type,
        locale,
        page,
      }),
    };
  }

  private async getTrending({ user: user_id, media_type, time_window, language }: TmdbGetTrending): Promise<GetTabResponse> {
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;
    const raw_data = await this.api.trending({ media_type, time_window, language });
    let data = raw_data.results as any[];

    const items = user.appendUserAttributes(convert.prepareTmdbForFrontend(data), client);

    return {
      tmdb: true,
      key: 'trending',
      length: items.length,
      items: items,
      query: removeEmpty({}),
    };
  }

  async getRecommendations({ user: user_id, id, type, locale }: GetRecommendations) {
    const client = await user.find(user_id);
    const params = { id, language: locale };
    const res = (await (isMovie(type) ? this.api.movieRecommendations(params) : this.api.tvRecommendations(params))).results;

    const adapted = convert.prepareTmdbForFrontend(res!);

    return user.appendUserAttributes(adapted, client);
  }

  async upcoming({ user: user_id, type, locale, page }: TmdbGetUpcoming): Promise<GetTabResponse> {
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;
    const params: UpcomingMoviesRequest = { language: locale, region: locale, page };

    const items = isMovie(type) ? (await this.api.upcomingMovies(params)).results! : [];

    const adapted = user.appendUserAttributes(convert.prepareTmdbForFrontend(items), client);

    return {
      tmdb: true,
      key: 'upcoming',
      length: adapted.length,
      items: adapted,
      query: removeEmpty({
        type,
        locale,
        page,
      }),
    };
  }
}

export const tmdb = new Tmdb();
export default tmdb;
