import tabs from '@data/tabs.json';
import { TabFilterOptions } from '@utils/types';

class Filter {
  tabs: {
    [name: string]: TabFilterOptions;
  };
  constructor() {
    this.tabs = tabs;
  }
}

export const filter = new Filter();
export default filter;
