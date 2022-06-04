import filters from '@data/search.filters.json';
import { sortByKey } from '@m2vi/iva';
import { SimpleObject } from '@Types/common';
import { FrontendItemProps } from '@Types/items';
import { FilterProps } from '@Types/search';
import has from 'lodash/has';
import { matchSorter } from 'match-sorter';
import sift from 'sift';

class Search {
  get filters(): FilterProps[] {
    return filters;
  }

  applyFilter(
    raw: FrontendItemProps[],
    filter: SimpleObject<{
      key: string;
      name: string;
      value: string;
      reverse?: boolean;
    }>,
    query: string
  ) {
    let items = raw;
    items = sortByKey(items, 'name');

    if (has(filter, 'sort_key')) {
      items = sortByKey(items, filter?.sort_key?.value!);
      if (filter?.sort_key?.reverse) items = items.reverse();
    } else {
      items = sortByKey(items, 'name');
    }

    Object.entries(filter).forEach(([property, value]) => {
      if (property === 'sort_key' || typeof value.value === 'undefined' || !property) return;

      items = items.filter(sift({ [property]: value.value }));
    });

    console.log(query);

    items = query ? matchSorter(items, query, { keys: ['name', 'id_db', 'details.fileName'] }) : items;

    return items;
  }
}

export const search = new Search();
export default search;
