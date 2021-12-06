import tabs from '@data/tabs.json';
import { TabFilterOptions } from '@utils/types';
import _ from 'underscore';

class Filter {
  tabs: {
    [name: string]: TabFilterOptions;
  };
  constructor() {
    this.tabs = tabs;
  }

  getUnderscore() {
    const t = this.tabs;

    return Object.entries(t).map(([property, { filter = {}, includeGenres = null, reverse = false, sort_key = false }]) => {
      return {
        filter: (items: any[]) => {
          let filtered = _.filter(items, filter);

          if (includeGenres) {
          }
        },
      };
    });
  }

  getMongoose() {
    const t = this.tabs;
  }
}

export const filter = new Filter();
export default filter;
