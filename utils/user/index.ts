import { UserRatings } from '@Types/ratings';
import { UserItem, UserProps } from '@Types/user';
import db from '@utils/db/main';
import { IncomingMessage } from 'http';
import { nanoid } from 'nanoid';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import jwt from 'jsonwebtoken';
import cache from '@utils/apis/cache';
import _, { round } from 'lodash';
import { removeEmpty, sortByKey } from '@m2vi/iva';
import { arrayMove } from '@utils/utils';
import { NextApiRequest } from 'next';

//! security
class User {
  async getRatings(id: string): Promise<UserRatings> {
    await db.init();
    return db.removeId(await db.ratingSchema.find({ author: id }).lean());
  }

  boiler(id: string): UserProps {
    return {
      token: nanoid(32),
      identifier: id.toString(),
      items: [],
      history: [],
      notifications: [],
      created_at: Date.now(),
    };
  }

  async exists(id: string) {
    await db.init();
    return Boolean(await db.userSchema.exists({ identifier: id }));
  }

  async find(id: string, c: boolean = false): Promise<UserProps> {
    if (!id) return null as any;
    if (c) {
      await db.init();
      const u = await db.userSchema.findOne({ $or: [{ identifier: id }, { token: id }] }).lean();

      return u;
    }
    const client = await cache.user.get(id);

    return client;
  }

  async create(id: string) {
    await db.init();
    if (await this.exists(id)) return { error: 'Account already exists' };
    const doc = new db.userSchema(this.boiler(id));

    return await doc.save();
  }

  async delete(id: string) {
    await db.init();

    return await db.userSchema.deleteOne({ identifier: id });
  }

  getIdFromRequest(
    req:
      | (IncomingMessage & {
          cookies: NextApiRequestCookies;
        })
      | NextApiRequest,
    real: boolean = false
  ) {
    if (real) {
      if (req?.cookies?.token) {
        try {
          const c = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);

          if (!c) return null;

          return (c as any)?.id ? (c as any)?.id : null;
        } catch (error) {
          return null;
        }
      } else {
        return null;
      }
    }

    if (req?.cookies?.token) {
      return (jwt.decode(req.cookies.token) as any)?.id;
    } else if ((req as any)?.query?.user) {
      return (req as any)?.query?.user;
    } else {
      return null;
    }
  }

  async getItems(id: string, c: boolean = false): Promise<UserItem[]> {
    const user = await this.find(id, c);

    return user.items;
  }

  async updateIndex(id: string) {
    await db.init();
    const base = await this.getItems(id, true);
    let items: UserItem[] = base;
    items = sortByKey(items, 'index');
    items = items.map((item, index) => ({ ...item, index: index }));

    await db.userSchema.updateOne({ identifier: id }, { items });

    return items;
  }

  async setItem(id: string, item: UserItem, toStart: boolean = false) {
    await db.init();
    let items = sortByKey(await this.getItems(id, true), 'index');
    const found = _.find(items, { filter: { id: item.filter.id, type: item.filter.type } });
    if (found) {
      const index = _.findIndex(items, { filter: item.filter });
      items[index] = { ...found, ...removeEmpty(item), index: toStart ? items.length : index };
    } else {
      items.push({ ...item, index: items.length });
    }

    await db.userSchema.updateOne({ identifier: id }, { items });
    await this.updateIndex(id);

    const newU = await cache.user.refresh(id);

    return _.find(newU.items, { filter: item.filter });
  }

  async move(id: string, item: Partial<UserItem>, index: number) {
    return; // broken
    await db.init();
    let items = sortByKey(await this.getItems(id), 'index');

    items = arrayMove(items, _.findIndex(items, item), items.length);

    await db.userSchema.updateOne({ identifier: id }, { items });
    await user.updateIndex(id);

    return items[index];
  }

  appendUserAttributes<T>(items: T[], user: UserProps | null): T[] {
    return items.map((item) => {
      const user_item = user?.items?.find(({ filter }) => filter.id === (item as any)?.id_db && filter.type === (item as any).type);
    
      return {
        ...item,
        user_state: typeof user_item?.state !== 'undefined' ? user_item?.state : null,
        user_rating: typeof user_item?.rating !== 'undefined' ? user_item?.rating : null,
        user_index: typeof user_item?.index !== 'undefined' ? user_item?.index : null,
        // user_date_added: null,
      };
    });
  }

  async get(id: string) {
    const u = await this.find(id);
    const ratings = u.items.filter(({ rating }) => rating !== null);

    return {
      id: u.identifier,
      average_rating: round(parseFloat((ratings.reduce((prev, curr) => prev + curr.rating!, 0) / ratings.length).toPrecision(12)), 1),
      ratings: ratings.length,
      last_ratings: sortByKey(ratings, 'index')
        .reverse()
        .slice(0, 20)
        .map(({ filter, rating }) => ({
          ...filter,
          rating,
        })),
    };
  }
}

export const user = new User();
export default user;
