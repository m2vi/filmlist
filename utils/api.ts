import { Connection, FilterQuery, ObjectId, Schema } from 'mongoose';
import { connectToDatabase } from './database';
import { sortByKey } from './array';
import genreList from '../data/genres.json';
import tabs from '../data/tabs.json';
import itemSchema from '../models/itemSchema';
import _ from 'underscore';
import { GenreProps, InsertProps, ItemProps, Tabs } from './types';

export class Filter {}

export class Api {
  genres: GenreProps[];
  tabs: Tabs;
  constructor() {
    this.genres = sortByKey(genreList.data, 'name');
    this.tabs = tabs;
  }

  private async init(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }

  async prepareForFrontend(
    items: ItemProps[] = [],
    locale: string = 'en',
    sortKey: string = 'name',
    start: number = 0,
    end: number = 50
  ): Promise<ItemProps[]> {
    const mapped = items.map(({ _id, genre_ids, name, poster_path, release_date }) => ({
      _id,
      genre_ids,
      name: name[locale],
      poster_path: poster_path[locale],
      release_date,
    }));
    const sorted = sortByKey(mapped, sortKey);
    const sliced = sorted.slice(start, end);

    return sliced;
  }

  private getFilterForGenre(genre_id: number): FilterQuery<ItemProps> {
    return {
      genre_ids: genre_id,
    };
  }

  async find(filter: FilterQuery<ItemProps>): Promise<ItemProps[]> {
    await this.init();
    const items = await itemSchema.find(filter).lean<any>();

    return items;
  }

  async findOne(filter: FilterQuery<ItemProps>): Promise<ItemProps> {
    await this.init();
    const item = await itemSchema.findOne(filter).lean<any>();

    return item;
  }

  async exists(filter: FilterQuery<ItemProps>): Promise<boolean> {
    const item = await this.findOne(filter);

    return item ? true : false;
  }

  async insert(item: InsertProps): Promise<ItemProps | boolean> {
    const exists = await this.exists({ id_db: item.id_db, type: item.type });

    return false;
  }

  arrayToFind(items: ItemProps[]) {
    type Partial<T> = {
      [P in keyof T]?: T[P];
    };

    return (filter: Partial<ItemProps>) => _.where(items, filter);
  }

  async stats() {
    const db = await this.init();
    const collection = await itemSchema.find().lean<ItemProps[]>();
    const find = api.arrayToFind(collection);

    const genreStats = () => {
      let genres = {} as any;

      this.genres.forEach(({ id, name }) => {
        genres[name.toLowerCase()] = collection.filter(({ genre_ids }) => genre_ids.includes(id)).length;
      });

      return genres;
    };

    const tabStats = () => {
      let tabs = {} as any;

      Object.entries(this.tabs).forEach(([name, { filter = {}, includeGenres = null }]) => {
        let results = _.where(collection, filter);

        if (includeGenres) {
          results = (results as any[]).reduce((results, result) => {
            const { genre_ids } = result;

            genre_ids.some((id: number) => includeGenres?.includes(id)) && results.push(result);

            return results;
          }, []);
        }

        tabs[name.toLowerCase()] = results.length;
      });

      return tabs;
    };

    return {
      entries: collection?.length,
      general: {
        movies: find({ type: 1 }).length,
        tv: find({ type: 0 }).length,
      },
      genres: genreStats(),
      tabs: tabStats(),
    };
  }
}

export const api = new Api();

export default api;
