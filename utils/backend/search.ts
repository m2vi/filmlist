import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { matchSorter } from 'match-sorter';
import backend from './api';
import client, { api } from '../tmdb/api';

interface SearchOptions {
  items?: ItemProps[];
  locale: string;
  start?: number;
  end?: number;
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

  async get(pattern: string = '', { locale = 'en' }: SearchOptions) {
    try {
      const tmdb_results = await this.getTMDB(pattern, { locale });

      return tmdb_results;
    } catch (error) {
      return [];
    }
  }

  async db(pattern: string = '', { locale = 'en', end }: SearchOptions) {
    const cached = await backend.cachedItems();
    const items = cached.items;

    const results = this.matchSorter(items, pattern);

    const data = backend.prepareForFrontend(await client.adaptTabs(client.getTabeBase(results, results)), locale).reverse();

    return data;
  }

  async getTMDB(pattern: string, { locale }: SearchOptions) {
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
        });
      })
    );

    const prepared = this.prepare(adapted, { locale, start: 0, end: Number.MAX_SAFE_INTEGER });

    return prepared;
  }
}

export const search = new Search();
export default search;
