import backend from '@utils/backend/api';
import { CreditProps, ItemProps, MovieDbTypeEnum, ProviderEntryProps, ProviderProps } from '@utils/types';
import { validateEnv } from '@utils/utils';
import { MovieDb } from 'moviedb-promise';
import companies from '@data/companies.json';
import _, { shuffle } from 'underscore';
import { CreditsResponse, IdRequestParams } from 'moviedb-promise/dist/request-types';
import streaming from '@data/streaming.json';

export const api = new MovieDb(validateEnv('MOVIE_TOKEN'));

export class Client {
  api: MovieDb;
  constructor() {
    this.api = api;
  }

  async watchProviders(providers: any, isMovie: boolean, params: IdRequestParams): Promise<ProviderEntryProps | null> {
    try {
      let AT = providers.AT;
      if (!AT) AT = (await (isMovie ? api.movieWatchProviders(params) : api.tvWatchProviders(params))).results!.AT;
      if (!AT) return null;

      const flatrate = AT.flatrate?.map(
        ({ logo_path, provider_id, provider_name }: any): ProviderProps => ({
          id: provider_id,
          name: provider_name,
          logo: logo_path,
          type: 'flatrate',
        })
      );
      const buy = AT.buy?.map(
        ({ logo_path, provider_id, provider_name }: any): ProviderProps => ({
          id: provider_id,
          name: provider_name,
          logo: logo_path,
          type: 'flatrate',
        })
      );

      return {
        url: AT.link,
        providers: (flatrate ? flatrate : []).concat(buy ? buy : []),
      };
    } catch (error) {
      return null;
    }
  }

  subscribedProvider({ watchProviders }: ItemProps) {
    if (!watchProviders) return [];
    const { subscribed } = streaming;
    const streams: any = [];

    watchProviders.providers.every(({ name }) => {
      const item = subscribed.find(({ name }) => name === name);
      if (!item) true;

      streams.push({
        url: watchProviders.url,
        ...item,
      });

      return false;
    });

    return streams;
  }

  async getBase(id: number, type: MovieDbTypeEnum) {
    const isMovie = (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
    const de = (await (isMovie ? api.movieInfo({ id, language: 'de' }) : api.tvInfo({ id, language: 'de' }))) as any;
    const en = (await (isMovie
      ? api.movieInfo({ id, language: 'en', append_to_response: 'credits,watch/providers,external_ids' })
      : api.tvInfo({ id, language: 'en', append_to_response: 'credits,watch/providers,external_ids' }))) as any;
    const watchProviders = await this.watchProviders(en['watch/providers'], isMovie, { id, language: 'en' });

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
    };
  }

  async dataForUpdate(id: number, type: MovieDbTypeEnum): Promise<Partial<ItemProps>> {
    const { isMovie, de, en, credits, external_ids, watchProviders } = await this.getBase(id, type);

    return {
      external_ids,
      overview: {
        en: en.overview,
        de: de.overview,
      },
      name: {
        en: isMovie ? en.title : en.name,
        de: isMovie ? de.title : de.name,
      },
      poster_path: {
        en: en.poster_path,
        de: de.poster_path,
      },
      backdrop_path: {
        en: en.backdrop_path,
        de: de.backdrop_path,
      },
      vote_average: en.vote_average,
      vote_count: en.vote_count,
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
      runtime: (isMovie ? en.runtime : en.episode_run_time ? en.episode_run_time[0] : null)
        ? isMovie
          ? en.runtime
          : en.episode_run_time[0]
        : null,
      watchProviders,
      collection: isMovie ? (en.belongs_to_collection ? en.belongs_to_collection : null) : null,
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

  async adapt(
    id: number,
    type: MovieDbTypeEnum,
    base?: { isMovie: boolean; de: any; en: any; credits: any; external_ids: any; watchProviders: any }
  ): Promise<Partial<ItemProps>> {
    const { isMovie, de, en, credits, external_ids, watchProviders } = base ? base : await this.getBase(id, type);

    return {
      external_ids,
      overview: {
        en: en.overview,
        de: de.overview,
      },
      genre_ids: (en?.genres ? en?.genres?.map(({ id }: any) => id) : en.genre_ids)?.concat(this.isAnime(en) ? [7424] : []),
      id_db: parseInt(id as any),
      name: {
        en: isMovie ? en.title : en.name,
        de: isMovie ? de.title : de.name,
      },
      original_language: en.original_language,
      original_name: isMovie ? en.original_title : en.original_name,
      poster_path: {
        en: en.poster_path,
        de: de.poster_path,
      },
      backdrop_path: {
        en: en.backdrop_path,
        de: en.backdrop_path,
      },
      vote_average: en.vote_average,
      vote_count: en.vote_count,
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
      runtime: (isMovie ? en.runtime : en.episode_run_time ? en.episode_run_time[0] : null)
        ? isMovie
          ? en.runtime
          : en.episode_run_time[0]
        : null,
      type: isMovie ? 1 : 0,
      credits: credits ? this.adaptCredits(credits) : null,
      watchProviders,
      collection: isMovie ? (en.belongs_to_collection ? en.belongs_to_collection : null) : null,
    };
  }

  async get(id: number, type: MovieDbTypeEnum, { state = -1 }) {
    const adapted = await this.adapt(id, type);

    return {
      ...adapted,
      state,
    };
  }

  getTabeBase(en: any, de: any) {
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
        });

        return backend.toFrontendItem(adapted as any);
      })
    );
  }

  async getTrends() {
    //! CHECK
    const base = this.getTabeBase(
      (await api.trending({ language: 'de', time_window: 'day', media_type: 'all' })).results,
      (await api.trending({ language: 'en', time_window: 'day', media_type: 'all' })).results
    );
    const adapted = await this.adaptTabs(base);

    return {
      trends: {
        length: adapted.length,
        name: 'trends',
        route: null,
        items: adapted,
      },
    };
  }

  async getCompany(id: number) {
    const jr = _.find(companies.data, { id })!;
    if (!jr) return null;

    const base = this.getTabeBase(
      (await api.discoverMovie({ with_companies: id.toString(), language: 'de' })).results,
      (await api.discoverMovie({ with_companies: id.toString(), language: 'en' })).results
    );
    const adapted = await this.adaptTabs(base);

    return {
      length: adapted.length,
      name: jr.name,
      route: jr.homepage,
      items: adapted,
    };
  }

  async getTabs() {
    return {
      ...(await this.getTrends()),
    };
  }

  async getCompanyTabs() {
    const ids = shuffle(companies.ids).slice(0, 3);
    let result = {} as any;

    for (const index in ids) {
      const id = ids[index];

      const entry = await this.getCompany(id);
      if (entry) {
        result[id] = entry;
      }
    }

    return result;
  }

  async getPerson(id: number, locale: string) {
    const data = await api.personInfo({ id, language: locale });

    return {
      info: data,
    };
  }

  async getPersonItems(id: number, locale: string) {
    return {
      tab: await backend.getTab({ tab: 'person', locale, start: 0, end: 75, includePerson: id }),
    };
  }

  async getRecommendations(isMovie: boolean, { id }: IdRequestParams, locale: string) {
    try {
      const res = (
        await (isMovie ? api.movieRecommendations({ id: id, language: locale }) : api.tvRecommendations({ id, language: locale }))
      ).results;
      const adapted = await this.adaptTabs(this.getTabeBase(res, res));

      return adapted;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  getAverageRating(items: ItemProps[]) {
    items = items.filter(({ vote_average }) => vote_average);
    const sum = items.reduce((a, { vote_average }) => a + vote_average, 0);
    const avg = sum / items.length || 0;

    return avg;
  }
}

export const client = new Client();
export default client;
