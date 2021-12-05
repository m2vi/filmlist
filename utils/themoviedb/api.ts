import backend, { Api } from '@utils/backend/api';
import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { stringToBoolean, validateEnv } from '@utils/utils';
import { MovieDb } from 'moviedb-promise';
import { shuffle } from 'underscore';

export const api = new MovieDb(validateEnv('MOVIE_TOKEN'));

export class Client {
  api: MovieDb;
  constructor() {
    this.api = api;
  }

  async getBase(id: number, type: MovieDbTypeEnum) {
    const isMovie = (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
    const de = (await (isMovie ? api.movieInfo({ id, language: 'de' }) : api.tvInfo({ id, language: 'de' }))) as any;
    const en = (await (isMovie ? api.movieInfo({ id, language: 'en' }) : api.tvInfo({ id, language: 'en' }))) as any;

    return {
      isMovie,
      de,
      en,
    };
  }

  async dataForUpdate(id: number, type: MovieDbTypeEnum) {
    const { isMovie, de, en } = await this.getBase(id, type);

    return {
      name: {
        en: isMovie ? en.title : en.name,
        de: isMovie ? de.title : de.name,
      },
      poster_path: {
        en: isMovie ? en.poster_path : en.poster_path,
        de: isMovie ? de.poster_path : de.poster_path,
      },
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
    };
  }

  isAnime(base: any): boolean {
    const genre_ids: number[] = base.genre_ids?.map(({ id }: any) => id);
    const original_language: string = base.original_language;

    if (!genre_ids || !original_language) {
      return false;
    }

    if (genre_ids.includes(7424) || (genre_ids.includes(16) && original_language === 'ja')) {
      return true;
    }

    return false;
  }

  async adapt(id: number, type: MovieDbTypeEnum, base?: { isMovie: boolean; de: any; en: any }): Promise<Partial<ItemProps>> {
    const { isMovie, de, en } = base ? base : await this.getBase(id, type);

    return {
      genre_ids: (en?.genres ? en?.genres?.map(({ id }: any) => id) : en.genre_ids)?.concat(this.isAnime(en) ? [7424] : []),
      id_db: parseInt(id as any),
      name: {
        en: isMovie ? en.title : en.name,
        de: isMovie ? de.title : de.name,
      },
      original_language: en.original_language,
      original_name: isMovie ? en.original_title : en.original_name,
      poster_path: {
        en: isMovie ? en.poster_path : en.poster_path,
        de: isMovie ? de.poster_path : de.poster_path,
      },
      release_date: new Date(isMovie ? en.release_date : en.first_air_date).getTime(),
      type: isMovie ? 1 : 0,
    };
  }

  async get(id: number, type: MovieDbTypeEnum, { favoured = 'false', watched = 'false' }) {
    const adapted = await this.adapt(id, type);

    return {
      favoured: stringToBoolean(favoured),
      ...adapted,
      watched: stringToBoolean(watched),
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
        const adapted = await this.adapt(en?.id, MovieDbTypeEnum[isMovie ? 'movie' : 'tv'], { isMovie, de, en });

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

  async getTabs() {
    return {
      ...(await this.getTrends()),
    };
  }
}

export const client = new Client();
export default client;
