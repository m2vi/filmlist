import { basicFetch } from '@utils/fetch';
import helper from '@utils/helper/main';
import notifications from '@utils/notifications/api';
import { ManageDeleteProps, ManageInsertProps, ManageMoveProps, ManageUpdateProps } from '@utils/types';
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

  async delete({ id_db, type }: ManageDeleteProps) {
    if ([id_db, type].includes('')) return notifications.error(`Missing arguments`);

    return await this.fetch('delete', `?${QueryString.stringify({ id: id_db, type: helper.isMovie(type) ? 'movie' : 'tv' })}`);
  }

  async move({ id_db, type, position }: ManageMoveProps) {
    if ([id_db, type, position].includes('')) return notifications.error(`Missing arguments`);

    return await this.fetch(
      'move',
      `?${QueryString.stringify({
        position: parseInt(position),
        filter: JSON.stringify({ id: parseInt(id_db), type: helper.isMovie(type) ? 1 : 0 }),
      })}`
    );
  }

  async update({ id_db, type }: ManageUpdateProps) {
    if ([id_db, type].includes('')) return notifications.error(`Missing arguments`);

    const result = await this.fetch(
      'update',
      `?${QueryString.stringify({
        id: id_db,
        type: helper.isMovie(type) ? 'movie' : 'tv',
      })}`
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
