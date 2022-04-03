import { removeEmpty } from '@m2vi/iva';
import { GetRecommendations, GetTabResponse } from '@Types/filmlist';
import { MovieDbTypeEnum } from '@Types/items';
import { TmdbGetTab, TmdbGetTrending } from '@Types/tmdb';
import convert from '@utils/convert/main';
import { isMovie } from '@utils/helper/tmdb';
import user from '@utils/user';
import _ from 'lodash';
import moment from 'moment';
import { MovieDb } from 'moviedb-promise';
import {
  CollectionRequest,
  DiscoverMovieRequest,
  DiscoverTvRequest,
  IdAppendToResponseRequest,
  IdRequestParams,
} from 'moviedb-promise/dist/request-types';

class Tmdb {
  api: MovieDb;
  constructor() {
    this.api = new MovieDb(process.env.MOVIE_TOKEN!);
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

    const client = await user.find(user_id);

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
    const client = await user.find(user_id);
    const raw_data = await this.api.trending({ media_type, time_window, language });
    let data = raw_data.results as any[];
    //  if (media_type === 'all') data = raw_data.results!.filter((item: any) => _.has(item, 'media_type'));
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

  async whenisthenextmcufilm(locale: string = 'en') {
    const result = await tmdb.api.discoverMovie({
      language: locale,
      with_companies: '420',
      sort_by: 'primary_release_date.asc',
      'primary_release_date.gte': moment().format('YYYY-MM-DD'),
    });

    return convert.prepareTmdbForFrontend(result.results as any);
  }
}

export const tmdb = new Tmdb();
export default tmdb;
