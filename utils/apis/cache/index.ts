import { UserProps } from '@Types/user';
import db from '@utils/db/main';
import { connectToRedis } from '@utils/db/redis';
import { config } from './config';

type Keys = keyof typeof config;

const { parse, stringify } = JSON;

class Cache {
  get config() {
    return config;
  }

  key(key: string, project = 'filmlist') {
    return `${project}.${key}`;
  }

  get user() {
    return {
      get: async (id: string): Promise<UserProps> => {
        const redis = await connectToRedis();
        const cached = await redis.get(this.key(`user-${id}`));

        if (cached) {
          return parse(cached);
        } else {
          await db.init();
          const u = await db.userSchema.findOne({ $or: [{ identifier: id }, { token: id }] }).lean();

          await redis.set(this.key(`user-${id}`), stringify(u));

          return u;
        }
      },
      refresh: async (id: string): Promise<UserProps> => {
        const redis = await connectToRedis();
        await redis.del(this.key(`user-${id}`));

        const u = await this.user.get(id);

        return u;
      },
    };
  }

  async get<T>(key: Keys): Promise<T> {
    const key_d = config?.[key];
    const redis = await connectToRedis();
    const cached = await redis.get(this.key(key_d.key));

    if (cached) {
      return parse(cached);
    } else {
      const data: any = await key_d.data();

      await redis.set(this.key(key_d.key), stringify(data));

      return data;
    }
  }

  async refresh<T>(key: Keys) {
    const key_d = config?.[key];
    const redis = await connectToRedis();

    await redis.del(this.key(key_d.key));

    return await this.get<T>(key);
  }

  async flush() {
    const redis = await connectToRedis();
    return await redis.flushall();
  }

  async stats() {
    const redis = await connectToRedis();
    return await redis.info();
  }
}

export const cache = new Cache();
export default cache;
