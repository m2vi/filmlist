import { ItemProps } from '@utils/types';
import Fuse from 'fuse.js';
import { matchSorter } from 'match-sorter';
import backend from './api';
import { api } from '../themoviedb/api';

interface SearchOptions {
  items?: ItemProps[];
  locale: string;
  start?: number;
  end?: number;
}

class Search {
  fuse(list: ItemProps[] = [], pattern: string = '') {
    const fuse = new Fuse(list, {
      minMatchCharLength: 0,

      keys: ['name.de', 'name.en', 'original_name'],
    });

    const results = fuse.search(pattern).map(({ item }) => item);

    return results.length === 0 ? list : results;
  }

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
      const db_results = await this.getDB(pattern, { locale });
      const tmdb_results = await this.getTMDB(pattern, { locale });

      return [db_results, tmdb_results];
    } catch (error) {
      return [[], []];
    }
  }

  async getDB(pattern: string, { locale }: SearchOptions) {
    const items = await backend.find({});
    // const fused = this.fuse(items, pattern);
    const matched = this.matchSorter(items, pattern);
    const prepared = this.prepare(matched, { locale, start: 0, end: 20 });

    return prepared;
  }

  async getTMDB(pattern: string, { locale }: SearchOptions) {
    const results = (await api.searchMulti({ query: pattern, language: locale })).results?.filter(
      ({ media_type }: any) => media_type === 'tv' || media_type === 'movie'
    );

    const prepared = this.prepare(results as any, { locale, start: 0, end: 20 });

    return prepared;
  }
}

export const search = new Search();
export default search;