import backend from '@utils/backend/api';
import { CreditProps, ItemProps, MovieDbTypeEnum } from '@utils/types';
import { stringToBoolean, validateEnv } from '@utils/utils';
import { MovieDb } from 'moviedb-promise';
import companies from '@data/companies.json';
import _, { shuffle } from 'underscore';
import { CreditsResponse } from 'moviedb-promise/dist/request-types';

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
    const credits = await (isMovie ? api.movieCredits({ id, language: 'en' }) : api.tvCredits({ id, language: 'en' }));

    return {
      isMovie,
      de,
      en,
      credits,
    };
  }

  async dataForUpdate(id: number, type: MovieDbTypeEnum): Promise<Partial<ItemProps>> {
    const { isMovie, de, en, credits } = await this.getBase(id, type);

    return {
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
      credits: credits ? this.adaptCredits(credits) : null,
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

  async adapt(id: number, type: MovieDbTypeEnum, base?: { isMovie: boolean; de: any; en: any; credits: any }): Promise<Partial<ItemProps>> {
    const { isMovie, de, en, credits } = base ? base : await this.getBase(id, type);

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
      type: isMovie ? 1 : 0,
      credits: credits ? this.adaptCredits(credits) : null,
    };
  }

  async get(id: number, type: MovieDbTypeEnum, { favoured = 'false', watched = 'false' }) {
    const adapted = await this.adapt(id, type);

    return {
      favoured: stringToBoolean(favoured),
      ...adapted,
      watched: stringToBoolean(watched),
      hall_of_fame: false,
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
        const adapted = await this.adapt(en?.id, MovieDbTypeEnum[isMovie ? 'movie' : 'tv'], { isMovie, de, en, credits: null });

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
}

export const client = new Client();
export default client;
