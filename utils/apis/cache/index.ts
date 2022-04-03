import { TabsType } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import memoryCache from 'memory-cache';
import jsonTabs from '@data/tabs.json';

class Cache {
  get items() {
    return {
      get: async (): Promise<ItemProps[]> => {
        const cachedResponse = memoryCache.get('db-items');
        if (cachedResponse) {
          return cachedResponse;
        } else {
          await db.init();
          const items = await db.itemSchema.find().lean<ItemProps[]>();

          memoryCache.put('db-items', items, 6 * 1000 * 60 * 60);
          return items;
        }
      },
      refresh: async () => {
        memoryCache.del('db-items');
        const items = await this.items.get();

        return items;
      },
    };
  }
  get tabs() {
    return {
      get: async (): Promise<TabsType> => {
        return jsonTabs;
      },
      refresh: () => {},
    };
  }
}

export const cache = new Cache();
export default cache;
