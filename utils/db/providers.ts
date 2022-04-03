import { sortByKey } from '@m2vi/iva';
import { ItemProps } from '@Types/items';
import { ProviderProps } from '@Types/justwatch';

import cache from 'memory-cache';
import db from './main';
import { getUniqueListBy } from '../helper';

class Providers {
  private async dbProviders() {
    await db.init();
    const items = await db.itemSchema.find().select('watchProviders').lean<ItemProps[]>();
    const selected = items.map(({ watchProviders }) => (watchProviders?.providers ? watchProviders?.providers : []));
    const providers = selected.reduce((prev, curr) => prev.concat(curr));
    const mapped = providers.map(({ id, name, logo }) => ({ id, name, logo }));
    const unique = mapped.filter((value, index, self) => index === self.findIndex((t) => t.name === value.name));

    return sortByKey(getUniqueListBy(unique, 'name'), 'name');
  }

  async getCachedProviders(): Promise<ProviderProps[]> {
    if (cache.get('db-providers')) {
      return cache.get('db-providers');
    } else {
      return cache.put('db-providers', await this.dbProviders(), 6 * 1000 * 60 * 60);
    }
  }
}

export const providers = new Providers();
