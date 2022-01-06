import { basicFetch } from '@utils/fetch';
import { ManageInsertProps } from '@utils/types';

class Manage {
  async fetch(name: string, params: string) {
    try {
      const result = await basicFetch(`/api/action/${name}${params}`);
      if (result.error) throw Error(result.error);
      return result;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  async insert({ id_db, type, state }: ManageInsertProps) {
    return await this.fetch('insert', `?id=${id_db}&type=${type === '1' || type === 'movie' ? 'movie' : 'tv'}&state=${state}`);
  }
}

export const manage = new Manage();
export default manage;
