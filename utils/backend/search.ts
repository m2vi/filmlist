import { ItemProps } from '@utils/types';
import Fuse from 'fuse.js';
import { matchSorter } from 'match-sorter';
import api from './api';

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
    const mapped = items.map((item) => api.toFrontendItem(item, locale));

    return mapped.slice(start, end);
  }

  async get(pattern: string = '', { locale = 'en', items }: SearchOptions) {
    // const fused = this.fuse(items, pattern);
    const matched = this.matchSorter(items, pattern);
    const prepared = this.prepare(matched, { locale, start: 0, end: 75 });

    return prepared;
  }
}

export const search = new Search();
export default search;
