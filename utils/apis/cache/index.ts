import { FilmlistGenres, FilmlistProductionCompany, TabsType } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import jsonTabs from '@data/tabs.json';
import Redis from 'ioredis';

import _ from 'underscore';
import { performance } from 'perf_hooks';
import { UserProps } from '@Types/user';
import filmlist from '../filmlist';

const { parse, stringify } = JSON;

class Cache {
  private get redis() {
    const redis = new Redis(process.env.REDIS_URL!);

    return redis;
  }

  get user() {
    return {
      get: async (id: string): Promise<UserProps> => {
        const cached = await this.redis.get(`user-${id}`);

        if (cached) {
          return parse(cached);
        } else {
          await db.init();
          const u = await db.userSchema.findOne({ $or: [{ identifier: id }, { token: id }] }).lean();

          await this.redis.set(`user-${id}`, stringify(u));

          return u;
        }
      },
      refresh: async (id: string): Promise<UserProps> => {
        await this.redis.del(`user-${id}`);

        const u = await this.user.get(id);

        return u;
      },
    };
  }

  get productionCompanies() {
    return {
      get: async (): Promise<FilmlistProductionCompany[]> => {
        const cached = await this.redis.get('production_companies');

        if (cached) {
          const parsed = parse(cached);

          return parsed;
        } else {
          const data = await filmlist.productionCompanies();

          await this.redis.set('production_companies', stringify(data));

          return data as any;
        }
      },
      refresh: async (): Promise<FilmlistProductionCompany[]> => {
        await this.redis.del('production_companies');
        const data = await this.productionCompanies.get();

        return data;
      },
    };
  }

  get genres() {
    return {
      get: async (): Promise<FilmlistGenres> => {
        const cached = await this.redis.get('genres');

        if (cached) {
          const parsed = parse(cached);

          return parsed;
        } else {
          const data = await filmlist.genres();

          await this.redis.set('genres', stringify(data));

          return data;
        }
      },
      refresh: async (): Promise<FilmlistGenres> => {
        await this.redis.del('genres');
        const data = await this.genres.get();

        return data;
      },
    };
  }

  get items() {
    return {
      get: async (): Promise<ItemProps[]> => {
        const cachedResponse = await this.redis.get('items');

        if (cachedResponse) {
          const parsed = parse(cachedResponse);

          return parsed;
        } else {
          await db.init();

          const items = await db.itemSchema.find().lean<ItemProps[]>();

          await this.redis.set('items', stringify(items));
          return items;
        }
      },
      refresh: async () => {
        await this.redis.del('items');
        const items = await this.items.get();

        return items;
      },
    };
  }

  get itemsSm() {
    return {
      get: async (): Promise<Array<Partial<ItemProps>>> => {
        const cache = await this.redis.get('items-sm');

        if (cache) {
          return parse(cache);
        } else {
          await db.init();

          const items = await db.itemSchema.find().select('id_db type').lean<Array<Partial<ItemProps>>>();

          await this.redis.set('items-sm', stringify(items));
          return items;
        }
      },
      refresh: async (): Promise<Array<Partial<ItemProps>>> => {
        await this.redis.del('items-sm');
        const items = await this.itemsSm.get();

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

  async stats() {
    return await this.redis.info();
  }
}

export const cache = new Cache();
export default cache;
