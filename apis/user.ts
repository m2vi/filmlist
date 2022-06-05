import { UserItem, UserProps, UserRatings } from '@Types/user';
import { nanoid } from 'nanoid';
import mongodb from './mongodb';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { removeEmpty, sortByKey } from '@m2vi/iva';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { round } from 'lodash';
import { IncomingMessage } from 'http';
import cache from './cache';
import { MovieDbTypeEnum } from '@Types/items';
import { isMovie } from '@helper/main';

//! security
class User {
  async getRatings(id: string): Promise<UserRatings> {
    await mongodb.init();
    return mongodb.removeId(await mongodb.ratingSchema.find({ author: id }).lean());
  }

  async exists(id: string) {
    await mongodb.init();
    return Boolean(await mongodb.userSchema.exists({ identifier: id }));
  }

  async find(id: string, c: boolean = false): Promise<UserProps> {
    if (!id) return null as any;
    if (c) {
      await mongodb.init();
      const u = await mongodb.userSchema.findOne({ $or: [{ identifier: id }, { token: id }] }).lean();

      return u;
    }
    const client = await cache.user.get(id);

    return client;
  }

  async delete(id: string) {
    await mongodb.init();

    return await mongodb.userSchema.deleteOne({ identifier: id });
  }

  getIdFromRequest(
    req:
      | (IncomingMessage & {
          cookies: NextApiRequestCookies;
        })
      | NextApiRequest,
    real: boolean = false
  ): string | null | any {
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
    await mongodb.init();
    const base = await this.getItems(id, true);
    let items: UserItem[] = base;
    items = sortByKey(items, 'index');
    items = items.map((item, index) => ({ ...item, index: index }));

    await mongodb.userSchema.updateOne({ identifier: id }, { items });

    return items;
  }

  async setItem(id: string, item: UserItem, toStart: boolean = false) {
    await mongodb.init();
    let items = sortByKey(await this.getItems(id, true), 'index');
    const found = find(items, { filter: { id: item.filter.id, type: item.filter.type } });
    if (found) {
      const index = findIndex(items, { filter: item.filter });
      items[index] = { ...found, ...removeEmpty(item), index: toStart ? items.length : index };
    } else {
      items.push({ ...item, index: items.length });
    }

    await mongodb.userSchema.updateOne({ identifier: id }, { items });
    await this.updateIndex(id);

    const newU = await cache.user.refresh(id);

    return find(newU.items, { filter: item.filter });
  }

  appendUserAttributes<T>(items: T[], user: UserProps | null): T[] {
    return items.map((item) => {
      const user_item = user?.items?.find(({ filter }) => filter.id === (item as any)?.id_db && filter.type === (item as any).type);

      return {
        ...item,
        user_state: typeof user_item?.state !== 'undefined' ? user_item?.state : null,
        user_rating: typeof user_item?.rating !== 'undefined' ? user_item?.rating : null,
        user_index: typeof user_item?.index !== 'undefined' ? user_item?.index : null,
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

  async set(client_id: string, id: number, type: MovieDbTypeEnum, state: number, move: boolean) {
    return await this.setItem(client_id, { filter: { id, type: isMovie(type) ? 1 : 0 }, index: 0, rating: null, state }, move);
  }
}

export const user = new User();
export default user;
