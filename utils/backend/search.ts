import { ItemProps } from '@utils/types';
import Fuse from 'fuse.js';
import api from './api';

interface SearchOptions {
  items?: ItemProps[];
  locale: string;
  start: number;
  end?: number;
}

class Search {
  fuse(list: ItemProps[] = [], pattern: string = '') {
    const fuse = new Fuse(list, {
      findAllMatches: true,
      useExtendedSearch: true,

      minMatchCharLength: 0,

      keys: ['name.de', 'name.en', 'original_language', 'id_db'],
    });

    const results = fuse.search(pattern).map(({ item }) => item);

    return results.length === 0 ? list : results;
  }

  prepare(items: ItemProps[], { locale, start, end }: SearchOptions) {
    const mapped = items.map((item) => api.toFrontendItem(item, locale));

    return mapped.slice(start, end);
  }

  async get(pattern: string = '', { locale = 'en', start = 0, items }: SearchOptions) {
    const fused = this.fuse(items, pattern);
    const prepared = this.prepare(fused, { locale, start, end: start + 75 });

    return prepared;
  }
}

export const search = new Search();
export default search;
