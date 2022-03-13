import { sortByKey } from '@utils/array';
import { getUniqueListBy } from '@utils/utils';
import backend from './api';
import { ItemProps, ProviderProps } from '@utils/types';
import cache from 'memory-cache';

class Api {
  async getProviders(): Promise<ProviderProps[]> {
    const items = await backend.schema.find().select('watchProviders').lean<ItemProps[]>();
    const selected = items.map(({ watchProviders }) => (watchProviders?.providers ? watchProviders?.providers : []));
    const providers = selected.reduce((prev, curr) => {
      return prev.concat(curr);
    }, []);
    const mapped = providers.map(({ id, name, logo }) => {
      return {
        id,
        name,
        logo: logo ? logo : null,
      };
    });

    const unique = mapped.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name));

    return sortByKey(getUniqueListBy(unique, 'name'), 'name');
  }

  async getCachedProviders(): Promise<ProviderProps[]> {
    if (cache.get('providers')) {
      return cache.get('providers');
    } else {
      return cache.put('providers', await this.getProviders(), 6 * 1000 * 60 * 60);
    }
  }
}

export const config = new Api();
