import { sortByKey } from '@utils/array';
import { getUniqueListBy } from '@utils/utils';
import backend from './api';
import dataProviders from '@data/providers.json';
import { ProviderProps } from '@utils/types';

class Api {
  async getProviders(): Promise<ProviderProps[]> {
    const data = await backend.schema.find().select({ 'watchProviders.providers.logo': 1, 'watchProviders.providers.name': 1 }).lean();

    const arr = data.reduce((prev, curr) => {
      return prev.concat((curr?.watchProviders?.providers ? curr?.watchProviders?.providers : []) as any);
    }, []);

    return sortByKey(getUniqueListBy(arr, 'logo'), 'name');
  }

  getProvidersSync(): ProviderProps[] {
    const arr = dataProviders;

    return sortByKey(getUniqueListBy(arr, 'logo'), 'name');
  }
}

export const config = new Api();
