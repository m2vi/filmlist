import { FilmlistGenres, FilmlistProductionCompany, ProviderProps, TabsType } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import jsonTabs from '@data/tabs.json';

import _ from 'underscore';
import { UserProps } from '@Types/user';
import filmlist from '../filmlist';
import { connectToRedis } from './redis';
import fsm from '../filmlist/small';

const { parse, stringify } = JSON;

class Cache {
  get user() {
    return {
      get: async (id: string): Promise<UserProps> => {
        const redis = await connectToRedis();
        const cached = await redis.get(`user-${id}`);

        if (cached) {
          return parse(cached);
        } else {
          await db.init();
          const u = await db.userSchema.findOne({ $or: [{ identifier: id }, { token: id }] }).lean();

          await redis.set(`user-${id}`, stringify(u));

          return u;
        }
      },
      refresh: async (id: string): Promise<UserProps> => {
        const redis = await connectToRedis();
        await redis.del(`user-${id}`);

        const u = await this.user.get(id);

        return u;
      },
    };
  }

  get productionCompanies() {
    return {
      get: async (): Promise<FilmlistProductionCompany[]> => {
        const redis = await connectToRedis();
        const cached = await redis.get('production_companies');

        if (cached) {
          const parsed = parse(cached);

          return parsed;
        } else {
          const data = await fsm.productionCompanies();

          await redis.set('production_companies', stringify(data));

          return data as any;
        }
      },
      refresh: async (): Promise<FilmlistProductionCompany[]> => {
        const redis = await connectToRedis();
        await redis.del('production_companies');
        const data = await this.productionCompanies.get();

        return data;
      },
    };
  }

  get genres() {
    return {
      get: async (): Promise<FilmlistGenres> => {
        const redis = await connectToRedis();
        const cached = await redis.get('genres');

        if (cached) {
          const parsed = parse(cached);

          return parsed;
        } else {
          const data = await fsm.genres();

          await redis.set('genres', stringify(data));

          return data;
        }
      },
      refresh: async (): Promise<FilmlistGenres> => {
        const redis = await connectToRedis();
        await redis.del('genres');
        const data = await this.genres.get();

        return data;
      },
    };
  }

  get browse() {
    return {
      get: async (): Promise<ItemProps[]> => {
        const redis = await connectToRedis();
        const cachedResponse = await redis.get('browse');

        if (cachedResponse) {
          const parsed = parse(cachedResponse);

          return parsed;
        } else {
          await db.init();

          const items = await db.itemSchema
            .find()
            .select('id_db genre_ids name original_name popularity poster_path backdrop_path release_date ratings type runtime')
            .lean<ItemProps[]>();

          await redis.set('browse', stringify(items));
          return items;
        }
      },
      refresh: async () => {
        const redis = await connectToRedis();
        await redis.del('browse');
        const items = await this.browse.get();

        return items;
      },
    };
  }

  get items() {
    return {
      get: async (): Promise<ItemProps[]> => {
        const redis = await connectToRedis();
        const cachedResponse = await redis.get('items');

        if (cachedResponse) {
          const parsed = parse(cachedResponse);

          return parsed;
        } else {
          await db.init();

          const items = await db.itemSchema.find().lean<ItemProps[]>();

          await redis.set('items', stringify(items));
          return items;
        }
      },
      refresh: async () => {
        const redis = await connectToRedis();
        await redis.del('items');
        const items = await this.items.get();

        return items;
      },
    };
  }

  get itemsSm() {
    return {
      get: async (): Promise<Array<Partial<ItemProps>>> => {
        const redis = await connectToRedis();
        const cache = await redis.get('items-sm');

        if (cache) {
          return parse(cache);
        } else {
          await db.init();

          const items = await db.itemSchema.find().select('id_db type').lean<Array<Partial<ItemProps>>>();

          await redis.set('items-sm', stringify(items));
          return items;
        }
      },
      refresh: async (): Promise<Array<Partial<ItemProps>>> => {
        const redis = await connectToRedis();
        await redis.del('items-sm');
        const items = await this.itemsSm.get();

        return items;
      },
    };
  }

  get providers() {
    return {
      get: async (): Promise<ProviderProps[]> => {
        const redis = await connectToRedis();
        const cached = await redis.get('providers');

        if (cached) {
          const parsed = parse(cached);

          return parsed;
        } else {
          const data = await fsm.providers();

          await redis.set('providers', stringify(data));

          return data;
        }
      },
      refresh: async (): Promise<ProviderProps[]> => {
        const redis = await connectToRedis();
        await redis.del('providers');
        const data = await this.providers.get();

        return data;
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
    const redis = await connectToRedis();
    return await redis.info();
  }
}

export const cache = new Cache();
export default cache;
