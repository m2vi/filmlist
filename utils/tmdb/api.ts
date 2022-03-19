import backend from '@utils/backend/api';
import {
  CreditProps,
  GetTMDBTabProps,
  ItemProps,
  MovieDbTypeEnum,
  ProviderEntryProps,
  ProviderProps,
  RatingsOptions,
  Streaming,
} from '@utils/types';
import { removeEmpty } from '@utils/utils';
import { MovieDb } from 'moviedb-promise';
import _ from 'underscore';
import {
  CreditsResponse,
  DiscoverMovieRequest,
  DiscoverTvRequest,
  IdRequestParams,
  MovieImagesResponse,
  MovieResponse,
  MovieResult,
  MovieTranslationsResponse,
  ShowResponse,
  TvImagesResponse,
  TvResult,
  TvTranslationsResponse,
  VideosResponse,
  MovieReleaseDatesResponse,
  ShowContentRatingResponse,
  ReleaseDate,
} from 'moviedb-promise/dist/request-types';
import querystring from 'qs';
import { lowerCase } from 'lodash';
import { sortByKey } from '@utils/array';
import Vimdb from 'vimdb';
import rt from '@utils/rt/scraper';

export const api = new MovieDb(process.env.MOVIE_TOKEN!);

export class Client {
  api: MovieDb;
  constructor() {
    this.api = api;
  }

  async watchProviders(providers: any, isMovie: boolean, params: IdRequestParams): Promise<ProviderEntryProps | null> {
    try {
      let AT = providers?.results?.AT;
      if (!AT) AT = (await (isMovie ? api.movieWatchProviders(params) : api.tvWatchProviders(params))).results!.AT;

      if (!AT)
        return {
          url: null,
          providers: null,
        };

      const res = (AT.flatrate ? AT.flatrate : []).concat(AT?.ads ? AT?.ads : []).map(
        ({ logo_path, provider_id, provider_name }: any): ProviderProps => ({
          id: provider_id,
          key: lowerCase(provider_name),
          name: provider_name,
          logo: logo_path,
        })
      );

      return {
        url: AT.link,
        providers: res?.length > 0 ? res : null,
      };
    } catch (error) {
      return {
        url: null,
        providers: null,
      };
    }
  }

  async importantProviders({ watchProviders, id_db, type }: Partial<ItemProps>) {
    if (!watchProviders?.providers) return [];
    const config: Streaming = await backend.streaming();

    const important = watchProviders.providers
      .map((item) => {
        if (!config.important.map((str) => lowerCase(str)).includes(lowerCase(item.name))) return null;
        return {
          ...item,
          qs: querystring.stringify({ id: id_db, type, provider: item.name }),
        };
      })
      .filter((item) => item);

    return important;
  }

  async providers({ watchProviders, id_db, type }: Partial<ItemProps>) {
    if (!watchProviders?.providers) return [];

    const providers = watchProviders.providers
      .map((item) => {
        return {
          ...item,
          qs: querystring.stringify({ id: id_db, type, provider: item.name }),
        };
      })
      .filter((item) => item);

    return providers;
  }

  async subscribedProvider({ watchProviders, type, id_db }: Partial<ItemProps>) {
    if (!watchProviders?.providers) return [];
    const config: Streaming = await backend.streaming();

    const subscribed = watchProviders?.providers
      .map((item) => {
        const subbed = _.find(
          config.subscribed.map(({ name, ...props }) => ({ name: lowerCase(name), ...props })),
          {
            name: item.name?.toLowerCase(),
          }
        );

        if (!subbed) return null;
        return {
          ...item,
          qs: querystring.stringify({ id: id_db, type, provider: item.name }),
        };
      })
      .filter((item) => item);

    return subscribed;
  }

  getTranslationsFromBase(
    base: any,
    translations: MovieTranslationsResponse | TvTranslationsResponse,
    images: MovieImagesResponse | TvImagesResponse
  ): any {
    let translation = _.find(translations?.translations ? translations?.translations : [], { iso_639_1: 'de' })?.data;
    if (!translation) translation = _.find(translations?.translations ? translations?.translations : [], { iso_639_1: 'en' })?.data;
    const poster = _.find(images?.posters ? images?.posters : [], { iso_639_1: 'de' })?.file_path;
    const backdrop = _.find(images?.backdrops ? images?.backdrops : [], { iso_639_1: 'de' as any })?.file_path;

    const result = {
      overview: translation?.overview ? translation?.overview : base?.overview,
      name: translation?.title ? translation?.title : base?.title ? base?.title : base?.name,
      poster_path: poster ? poster : base?.poster_path,
      backdrop_path: backdrop ? backdrop : base?.backdrop_path,
    };

    return result;
  }

  isMovie(type: any) {
    return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
  }

  isTV(type: any) {
    return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.tv || type.toString() === '0';
  }

  async getBase(id: number, type: MovieDbTypeEnum, fast: boolean = false) {
    const imdb = new Vimdb();

    const params = {
      id,
      language: 'en-GB',
      include_image_language: 'en,de,null',
      append_to_response: 'credits,watch/providers,external_ids,videos,images,translations,release_dates,content_ratings,keywords',
    };
    const isMovie = (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
    const [en] = await Promise.all([(isMovie ? api.movieInfo(params) : api.tvInfo(params)) as any]);
    const [imdb_data, rottentomatoes] = !fast
      ? await Promise.all([
          imdb.getShow(en.external_ids?.imdb_id).catch((reason) => undefined),
          isMovie
            ? rt
                .findMovie({ name: en.title ? en.title : en.name, year: new Date(en.release_date).getFullYear() })
                .catch((reason) => undefined)
            : rt.findTVShow({ title: en.title ? en.title : en.name }).catch((reason) => undefined),
        ])
      : [null, null];
    const watchProviders = await this.watchProviders(en['watch/providers'], isMovie, { id, language: 'en' });

    const de = this.getTranslationsFromBase(en, en?.translations, en?.images);

    return {
      isMovie,
      de,
      en,
      credits: en.credits
        ? {
            id: en.credits.id ? en.credits.id : null,
            cast: en.credits.cast ? en.credits.cast : null,
            crew: en.credits.crew ? en.credits.crew : null,
          }
        : null,
      external_ids: en.external_ids ? en.external_ids : null,
      watchProviders,
      imdb: imdb_data,
      rt: rottentomatoes,
    };
  }

  private tvCertificate(data: ShowContentRatingResponse) {
    const DE = _.find(data?.results!, { iso_3166_1: 'DE' });
    if (!DE) return null;

    return DE?.rating ? DE?.rating : null;
  }

  private movieCertificate(data: MovieReleaseDatesResponse) {
    const DE = _.find(data?.results!, { iso_3166_1: 'DE' });
    if (!DE) return null;

    const release_dates = DE?.release_dates!;

    const important: ReleaseDate[] = sortByKey(
      release_dates?.filter(({ certification }) => certification !== ''),
      'type'
    ).reverse();

    return important?.[0]?.certification ? important?.[0]?.certification : null;
  }

  certifcate(en: any, isMovie: boolean) {
    if (isMovie) return this.movieCertificate(en?.release_dates);
    if (!isMovie) return this.tvCertificate(en?.content_ratings);
    return null;
  }

  async dataForUpdate(id: number, type: MovieDbTypeEnum, fast: boolean = false): Promise<Partial<ItemProps>> {
    const { isMovie, de, en, credits, external_ids, watchProviders, imdb, rt } = await this.getBase(id, type, fast);

    return {
      status: en?.status ? en?.status : null,
      rated: this.certifcate(en, isMovie),
      external_ids,
      overview: {
        en: en.overview ? en.overview : '',
        de: de.overview ? de.overview : '',
      },
      name: {
        en: en.title ? en.title : en.name,
        de: de.title ? de.title : de.name,
      },
      poster_path: {
        en: en.poster_path ? en.poster_path : null,
        de: de.poster_path ? de.poster_path : en.poster_path ? en.poster_path : null,
      },
      backdrop_path: {
        en: en.backdrop_path ? en.backdrop_path : null,
        de: de.backdrop_path ? de.backdrop_path : en.backdrop_path ? en.backdrop_path : null,
      },
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
      runtime: (isMovie ? en.runtime : en.episode_run_time ? en.episode_run_time[0] : null)
        ? isMovie
          ? en.runtime
          : en.episode_run_time[0]
        : null,
      credits: credits ? this.adaptCredits(credits) : null,
      watchProviders,
      keywords: en?.keywords?.keywords ? en?.keywords?.keywords : [],
      collection: isMovie ? (en.belongs_to_collection ? en.belongs_to_collection : null) : null,
      trailers: en.videos ? this.getTrailers(en.videos) : null,
      ...(!fast
        ? {
            ratings: await this.ratings(
              {
                tmdb: {
                  name: en.title ? en.title : en.name,
                  vote_average: en.vote_average,
                  vote_count: en.vote_count,
                  release_date: en.release_date,
                  isMovie: isMovie,
                },
                imdb_id: external_ids?.imdb_id,
              },
              { imdb, rottentomatoes: rt }
            ),
          }
        : {}),
      number_of_episodes: en?.number_of_episodes ? en?.number_of_episodes : null,
      number_of_seasons: en?.number_of_seasons ? en?.number_of_seasons : null,
      popularity: en.popularity,
      updated_at: Date.now(),
    };
  }

  async ratings(
    { tmdb: { vote_average, vote_count, isMovie, name, release_date }, imdb_id }: RatingsOptions,
    base?: { imdb: any; rottentomatoes: any }
  ) {
    const year = new Date(release_date).getFullYear();

    const imdb = new Vimdb('en-GB');

    const [imdb_data, rt_result] = await Promise.all([
      base?.imdb || base?.imdb === null ? base?.imdb : imdb_id ? imdb.getShow(imdb_id).catch((reason) => null) : null,
      base?.rottentomatoes || base?.rottentomatoes === null
        ? base?.rottentomatoes
        : isMovie
        ? rt.findMovie({ name, year }).catch((reason) => null)
        : rt.findTVShow({ title: name }).catch((reason) => null),
    ]);

    return {
      tmdb: {
        vote_average: vote_average ? vote_average : null,
        vote_count: vote_count ? vote_count : null,
      },
      imdb: {
        vote_average: imdb_data?.aggregateRating?.ratingValue ? imdb_data?.aggregateRating?.ratingValue : null,
        vote_count: imdb_data?.aggregateRating?.ratingCount ? imdb_data?.aggregateRating?.ratingCount : null,
      },
      rt: {
        vote_average: rt_result?.meterScore ? rt_result?.meterScore / 10 : null,
        vote_count: null,
      },
    };
  }

  isAnime(base: any): boolean {
    const genre_ids: number[] = base.genres ? base.genres.map(({ id }: any) => id) : base.genre_ids;
    const original_language: string = base.original_language;

    if (!genre_ids || !original_language) {
      return false;
    }

    if (genre_ids.includes(7424) || (genre_ids.includes(16) && original_language === 'ja')) {
      return true;
    }

    return false;
  }

  adaptCredits(credits: CreditsResponse): CreditProps | null {
    if (!credits || typeof credits === 'undefined') return null;
    const { id, cast, crew } = credits;

    const newCast: any = cast?.map(({ character, gender, id, known_for_department, original_name, profile_path }) => ({
      character,
      gender,
      id,
      known_for_department,
      original_name,
      profile_path,
    }));

    const newCrew: any = crew?.map(({ department, gender, id, known_for_department, original_name, profile_path, job }) => ({
      department,
      gender,
      id,
      known_for_department,
      original_name,
      profile_path,
      job,
    }));

    return {
      id: id!,
      cast: newCast,
      crew: newCrew,
    };
  }

  getTrailers(videos: VideosResponse) {
    if (!videos.results) return null;

    return videos.results.filter(({ site, type }) => site === 'YouTube' && type === 'Trailer');
  }

  async adapt(
    id: number,
    type: MovieDbTypeEnum,
    base?: { isMovie: boolean; de: any; en: any; credits: any; external_ids: any; watchProviders: any; imdb: any; rt: any }
  ): Promise<ItemProps> {
    const { isMovie, de, en, credits, external_ids, watchProviders, imdb, rt } = base ? base : await this.getBase(id, type);

    return {
      state: null,
      status: en?.status ? en?.status : null,
      rated: this.certifcate(en, isMovie),
      external_ids,
      overview: {
        en: en.overview ? en.overview : '',
        de: de.overview ? de.overview : '',
      },
      genre_ids: (en?.genres ? en?.genres?.map(({ id }: any) => id) : en.genre_ids)?.concat(this.isAnime(en) ? [7424] : []),
      id_db: parseInt(id as any),
      name: {
        en: en.title ? en.title : en.name,
        de: de.title ? de.title : de.name,
      },
      original_language: en.original_language,
      original_name: isMovie ? en.original_title : en.original_name,
      poster_path: {
        en: en.poster_path ? en.poster_path : null,
        de: de.poster_path ? de.poster_path : en.poster_path ? en.poster_path : null,
      },
      backdrop_path: {
        en: en.backdrop_path ? en.backdrop_path : null,
        de: de.backdrop_path ? de.backdrop_path : en.backdrop_path ? en.backdrop_path : null,
      },
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
      runtime: (isMovie ? en.runtime : en.episode_run_time ? en.episode_run_time[0] : null)
        ? isMovie
          ? en.runtime
          : en.episode_run_time[0]
        : null,
      type: isMovie ? 1 : 0,
      credits: credits ? this.adaptCredits(credits) : null,
      keywords: en?.keywords?.keywords ? en?.keywords?.keywords : [],
      watchProviders,
      collection: isMovie ? (en.belongs_to_collection ? en.belongs_to_collection : null) : null,
      trailers: en.videos ? this.getTrailers(en.videos) : null,
      ratings: await this.ratings(
        {
          tmdb: {
            name: en.title ? en.title : en.name,
            vote_average: en.vote_average,
            vote_count: en.vote_count,
            release_date: en.release_date,
            isMovie: isMovie,
          },
          imdb_id: external_ids?.imdb_id,
        },
        { imdb, rottentomatoes: rt }
      ),
      number_of_episodes: en?.number_of_episodes ? en?.number_of_episodes : null,
      number_of_seasons: en?.number_of_seasons ? en?.number_of_seasons : null,
      popularity: en.popularity ? en.popularity : null,
      updated_at: null,
    };
  }

  async getFast(id: number, type: MovieDbTypeEnum): Promise<ItemProps> {
    const exists = await backend.exists({ id_db: id, type: this.isMovie(type) ? 1 : 0 });

    if (exists !== false) return exists;

    return await this.get(id, type, { state: null });
  }

  async get(id: number, type: MovieDbTypeEnum, { state = -1 }: { state: number | null }): Promise<ItemProps> {
    const adapted = await this.adapt(id, type);

    return {
      ...adapted,
      state,
    };
  }

  getTabBase(en: any, de: any) {
    const both = en?.map((entry: ItemProps, index: number) => {
      return [entry, (de as any)[index]];
    });

    return both;
  }

  async adaptTabs(base: any) {
    return await Promise.all(
      base!.map(async ([en, de]: any[]) => {
        const isMovie = de.title ? true : false;
        const adapted = await this.adapt(en?.id, MovieDbTypeEnum[isMovie ? 'movie' : 'tv'], {
          isMovie,
          de,
          en,
          credits: null,
          external_ids: null,
          watchProviders: null,
          imdb: null,
          rt: null,
        });

        return backend.toFrontendItem(adapted as any);
      })
    );
  }

  async getCompany(id: number, locale: string) {
    const data = await this.api.companyInfo({ id, language: locale });

    return data;
  }

  async getPerson(id: number, locale: string) {
    const data = await api.personInfo({ id, language: locale });

    return {
      info: data,
    };
  }

  async getPersonItems(id: number, locale: string) {
    return await backend.getTab({
      tab: '',
      custom_config: {
        filter: {
          $or: [{ 'credits.cast.id': id }, { 'credits.crew.id': id }],
        },
        sort_key: 'ratings.tmdb.vote_count',
        reverse: true,
      },
      locale,
      start: 0,
      end: 75,
      useCache: false,
    });
  }

  async getRecommendations(isMovie: boolean, { id }: IdRequestParams, locale: string) {
    try {
      const res = (
        await (isMovie ? api.movieRecommendations({ id: id, language: locale }) : api.tvRecommendations({ id, language: locale }))
      ).results;
      const adapted = await this.adaptTabs(this.getTabBase(res, res));

      return adapted;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  getAverageRating(items: Array<MovieResponse | ShowResponse>) {
    const filtered = items.filter(({ vote_average }) => vote_average);
    const sum = filtered.reduce((a, { vote_average }) => a + vote_average!, 0);
    const avg = sum / filtered.length || 0;

    return avg;
  }

  async getTrends({ locale, type, page }: Partial<GetTMDBTabProps>) {
    const isMovie = this.isMovie(type);
    const isTV = this.isTV(type);

    if (page !== 0)
      return {
        name: 'trending',
        route: isMovie || isTV ? `/${isMovie ? 'movie' : 'tv'}/trending` : null,
        length: 0,
        items: [],
        purpose: 'tmdb-tab',
        query: removeEmpty({
          tab: 'trending',
          type,
          locale,
          page,
          purpose: 'tmdb-tab',
        }),
      };

    const data = (await api.trending({ language: locale, time_window: 'day', media_type: isMovie ? 'movie' : isTV ? 'tv' : 'all' }))
      .results;
    const items = backend.prepareForFrontend(await this.adaptTabs(this.getTabBase(data, data))).reverse();
    return {
      name: 'trending',
      route: isMovie || isTV ? `/${isMovie ? 'movie' : 'tv'}/trending` : null,
      length: items?.length,
      items: items ? items : [],
      purpose: 'tmdb-tab',
      query: removeEmpty({
        tab: 'trending',
        type,
        locale,
        page: 2,
      }),
    };
  }

  async getTMDBTab({ tab, type, locale, page, purpose }: GetTMDBTabProps) {
    const isMovie = this.isMovie(type);

    let params = { language: locale, page } as DiscoverMovieRequest | DiscoverTvRequest;
    let items = [] as TvResult[] | MovieResult[] | undefined;

    switch (tab) {
      case 'top-rated':
        params = { language: locale, 'vote_count.gte': 500, sort_by: 'vote_average.desc', page };
        break;
      case 'popular':
        params = { language: locale, sort_by: 'popularity.desc', page };
        break;
      case 'trending':
        return await this.getTrends({ locale, type, page });
      case 'all-time-popular':
        params = { language: locale, sort_by: 'vote_count.desc', page };
        break;
    }

    items = (await (isMovie ? api.discoverMovie(params as any) : api.discoverTv(params as any))).results;

    items = await this.adaptTabs(this.getTabBase(items, items));

    const frontend = backend.prepareForFrontend(items as any, locale).reverse();
    return {
      name: tab,
      route: `/${isMovie ? 'movie' : 'tv'}/${tab}`,
      length: items?.length,
      items: frontend ? frontend : [],
      purpose: purpose ? purpose : 'tmdb-tab',
      query: removeEmpty({
        tab,
        type,
        locale,
        page,
        purpose,
      }),
    };
  }
}

export const client = new Client();
export default client;
