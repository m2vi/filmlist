import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { matchSorter } from 'match-sorter';
import backend from './api';
import client, { api } from '../tmdb/api';

interface SearchOptions {
  items?: ItemProps[];
  locale: string;
  start?: number;
  end?: number;
  tmdb?: boolean;
}

class Search {
  matchSorter(list: ItemProps[] = [], pattern: string = '') {
    return matchSorter(list, pattern, {
      keys: ['name.de', 'name.en', 'original_name', 'id_db'],
    });
  }

  prepare(items: ItemProps[], { locale, start, end }: SearchOptions) {
    const mapped = items.map((item, index) => {
      try {
        return backend.toFrontendItem(item, locale);
      } catch (error) {
        return null;
      }
    });

    return mapped.filter((item) => item).slice(start, end);
  }

  async get(pattern: string = '', { locale = 'en', tmdb = false }: SearchOptions) {
    try {
      if (tmdb) {
        return await this.tmdb(pattern, { locale, end: 50 });
      } else {
        return await this.db(pattern, { locale, end: 50 });
      }
    } catch (error) {
      return [];
    }
  }

  async db(pattern: string = '', { locale = 'en', end }: SearchOptions) {
    const cached = await backend.cachedItems();
    const items = cached.items;

    const results = this.matchSorter(items, pattern);

    const data = this.prepare(results, { locale, end });

    return data;
  }

  async tmdb(pattern: string, { locale, end }: SearchOptions) {
    const results = (await api.searchMulti({ query: pattern, language: locale })).results?.filter(
      ({ media_type }: any) => media_type === 'tv' || media_type === 'movie'
    );

    if (!results) return [];

    const adapted = await Promise.all(
      results!.map(async (item: any): Promise<any> => {
        return await client.adapt(item?.id, MovieDbTypeEnum[item.media_type as any] as any, {
          de: item,
          en: item,
          credits: null,
          external_ids: null,
          isMovie: item.media_type === 'movie',
          watchProviders: null,
          imdb: null,
          rt: null,
        });
      })
    );

    const prepared = this.prepare(adapted, { locale, end });

    return prepared;
  }
}

export const search = new Search();
export default search;
