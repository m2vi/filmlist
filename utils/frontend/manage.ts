import { basicFetch } from '@utils/fetch';
import helper from '@utils/helper/main';
import notifications from '@utils/notifications/api';
import { ManageInsertProps } from '@utils/types';
import QueryString from 'qs';
import api from './api';

class Manage {
  private async fetch(name: string, params: string) {
    try {
      const result = await basicFetch(`/api/db/${name}${params}`);
      if (result.error) throw Error(result.error);
      return result;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  async insert({ id_db, type, state }: ManageInsertProps) {
    if ([id_db, type, state].includes('')) return notifications.error(`Missing arguments`);

    return await this.fetch(
      'insert',
      `?${QueryString.stringify({ id: id_db, type: helper.isMovie(type) ? 'movie' : 'tv', state: state })}`
    );
  }

  async cache(el: 'items' | 'tabs' | 'ratings') {
    api
      .clearCache(el)
      .then(() => notifications.info(`Refreshed ${el}`))
      .catch(notifications.error);
  }
}

export const manage = new Manage();
export default manage;
