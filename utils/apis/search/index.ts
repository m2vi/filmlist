import { sortByKey } from '@m2vi/iva';
import { ItemProps } from '@Types/items';
import { UserProps } from '@Types/user';
import convert from '@utils/convert/main';
import user from '@utils/user';
import { matchSorter } from 'match-sorter';
import cache from '../cache';
import tmdb from '../tmdb';

interface SearchGet {
  query: string;
  locale: string;
  page: string;
  user_id: string | UserProps;
}

class Search {
  async get({ query, locale, user_id, page }: SearchGet) {
    if (page === 'tmdb') return await this.getTMDB({ query, locale, user_id, page });
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;
    let items = sortByKey(await cache.get<ItemProps[]>('items_f'), 'popularity').reverse();

    items = query ? matchSorter(items, query, { keys: ['name.de', 'name.en', 'original_name', 'id_db'] }) : items;

    return user.appendUserAttributes(convert.prepareForFrontend(items, locale), client).slice(0, 100);
  }

  private async getTMDB({ query, locale, user_id, page }: SearchGet) {
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;
    const data: any = (await tmdb.api.searchMulti({ query, language: locale }))?.results?.filter(
      ({ media_type }: any) => media_type === 'tv' || media_type === 'movie'
    );

    return user.appendUserAttributes(convert.prepareTmdbForFrontend(data), client).slice(0, 100);
  }
}

export const search = new Search();
export default search;
