import ratingSchema from '@models/ratingSchema';
import helper from '@utils/helper/main';
import { ItemProps } from '@utils/types';
import _ from 'lodash';
import cache from 'memory-cache';

export interface Filter {
  id_db: number;
  type: number;
}

export type Rating = number;

export interface SetArguments {
  author: string;
  filter: Filter;
  rating: Rating;
}

export interface GetResponse {
  identifier: string;
  rating: Rating;
}

export interface RatingProps {
  identifier: string;
  filter: Filter;
  rating: Rating;
}

export class Ratings {
  genIdentifier(author_id: string) {
    //? looks cool
    const author = Buffer.from(author_id, 'utf-8').toString('base64url');
    const timestamp = Buffer.from(new Date().getTime().toString(), 'utf-8').toString('base64url');

    return `${author}.${timestamp}`;
  }

  decodeIdentifier(id: string) {
    const author = Buffer.from(id.split('.')[0], 'base64url').toString('utf-8');
    const timestamp = Buffer.from(id.split('.')[1], 'base64url').toString('utf-8');

    return {
      author,
      timestamp: parseInt(timestamp),
    };
  }

  async getUserRatings(author: string) {
    await helper.dbInit();

    const regex = new RegExp(`^${Buffer.from(author, 'utf-8').toString('base64url')}`);

    const results = await ratingSchema.find({ identifier: { $regex: regex } }).lean<RatingProps>();

    return {
      query: author,
      data: results,
    };
  }

  async getAll(destroy: boolean = false): Promise<RatingProps[]> {
    if (!destroy && cache.get('ratings')) {
      return cache.get('ratings');
    } else {
      await helper.dbInit();

      const results = await ratingSchema.find().lean<any>();

      cache.put('ratings', results);

      return results;
    }
  }

  async appendRating(item: ItemProps) {
    const ratings = await this.getAll();

    const filter: Filter = { id_db: item.id_db, type: item.type };
    const rating = _.find(ratings, { filter }) as any;

    return {
      ...item,
      ratings: {
        ...item.ratings,
        user: {
          vote_average: rating ? (rating.rating as number) : null,
          vote_count: rating ? 1 : null,
        },
      },
    };
  }

  async appendRatings(items: ItemProps[]) {
    const ratings = await this.getAll();

    return items.map((item) => {
      const filter: Filter = { id_db: item.id_db, type: item.type };
      const rating = _.find(ratings, { filter }) as any;

      return {
        ...item,
        ratings: {
          ...item.ratings,
          user: {
            vote_average: rating ? (rating.rating as number) : null,
            vote_count: rating ? 1 : null,
          },
        },
      };
    });
  }

  async exists(filter: Filter) {
    await helper.dbInit();

    return Boolean(await ratingSchema.exists({ filter }));
  }

  async get(filter: Filter) {
    await helper.dbInit();
  }

  async set({ author, filter, rating }: SetArguments) {
    await helper.dbInit();

    if (await this.exists(filter)) {
      return await this.update({ author, filter, rating });
    }

    const id = this.genIdentifier(author);

    const item = { identifier: id, filter, rating };

    const doc = new ratingSchema(item);

    return await doc.save();
  }

  async update({ author, filter, rating }: SetArguments) {
    await helper.dbInit();
    ratingSchema.updateOne({ filter }, { identifier: this.genIdentifier(author), rating });

    return {
      identifier: this.genIdentifier(author),
      filter,
      rating,
    };
  }
}

export const ratings = new Ratings();
export default ratings;

//? Adapt when multiple users
