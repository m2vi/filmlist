import backend from '@utils/backend/api';
import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { stringToBoolean, validateEnv } from '@utils/utils';
import moment from 'moment';
import { MovieDb } from 'moviedb-promise';

export const api = new MovieDb(validateEnv('MOVIE_TOKEN'));

export class Client {
  api: MovieDb;
  constructor() {
    this.api = api;
  }

  async getBase(id: number, type: MovieDbTypeEnum) {
    const isMovie = (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie;
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
    };
  }

  async adapt(id: number, type: MovieDbTypeEnum, base?: { isMovie: boolean; de: any; en: any }): Promise<Partial<ItemProps>> {
    const { isMovie, de, en } = base ? base : await this.getBase(id, type);

    return {
      genre_ids: en.genres?.map(({ id }: any) => id) as number[],
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
      release_date: moment(isMovie ? en.release_date : en.first_air_date).unix(),
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
        const adapted = await this.adapt(en?.id, MovieDbTypeEnum.movie, { isMovie: true, de, en });

        return adapted;
      })
    );
  }

  async getTabs() {
    const nowPlaying = async () => {
      const base = this.getTabeBase(
        (await api.movieNowPlaying({ language: 'en' })).results,
        (await api.movieNowPlaying({ language: 'de' })).results
      );

      return await this.adaptTabs(base);
    };

    const popular = async () => {
      const base = this.getTabeBase(
        (await api.moviePopular({ language: 'en' })).results,
        (await api.moviePopular({ language: 'de' })).results
      );

      return await this.adaptTabs(base);
    };

    return { nowPlaying: await nowPlaying(), popular: await popular() };
  }
}

export const client = new Client();
export default client;
