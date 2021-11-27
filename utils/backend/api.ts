import { Connection, FilterQuery, ObjectId, Schema } from 'mongoose';
import { connectToDatabase } from '../database';
import { sortByKey } from '../array';
import genreList from '@data/genres.json';
import tabs from '@data/tabs.json';
import itemSchema from '@models/itemSchema';
import _ from 'underscore';
import { GenreProps, InsertProps, ItemProps, MovieDbTypeEnum, Tabs } from '../types';
import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import client from '@utils/themoviedb/api';

class Jwt {
  decode() {
    const cookie = cookies.get('token');
    if (!cookie) return false;
    return jwt.decode(cookie);
  }
}

export class Api {
  genres: GenreProps[];
  tabs: Tabs;
  jwt: Jwt;
  constructor() {
    this.genres = sortByKey(genreList.data, 'name');
    this.tabs = tabs;
    this.jwt = new Jwt();
  }

  private async init(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }

  private getFilterFromTab(name: string) {
    if (!this.tabs[name]?.filter) return {};

    return this.tabs[name].filter!;
  }

  async getTab({ tab, locale, sort, start, end }: { tab: string; locale: string; sort: string; start: number; end: number }) {
    const db = await this.init();
    const filter = this.getFilterFromTab(tab);
    const items = await this.find(filter);

    return this.prepareForFrontend(items, locale, sort, start, end);
  }

  toFrontendItem({ _id, genre_ids, name, poster_path, release_date }: ItemProps, locale: string = 'en') {
    return {
      _id,
      genre_ids,
      name: name[locale],
      poster_path: poster_path[locale],
      release_date,
    };
  }

  prepareForFrontend(
    items: ItemProps[] = [],
    locale: string = 'en',
    sortKey: string = 'name',
    start: number = 0,
    end: number = 50
  ): ItemProps[] {
    const mapped = items.map((item) => this.toFrontendItem(item, locale));
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
    try {
      const item = await this.findOne(filter);

      return item ? true : false;
    } catch (error) {
      return false;
    }
  }

  async insert({ id_db, type, favoured, watched }: InsertProps): Promise<ItemProps | any> {
    try {
      const exists = await this.exists({ id_db: parseInt(id_db as any), type: MovieDbTypeEnum[type] as any });
      if (exists) {
        return {
          error: 'Already exists',
        };
      }

      const data = await client.get(id_db, type, { favoured, watched });
      const doc = new itemSchema(data);

      return await doc.save();
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async insertMany(items: InsertProps[]): Promise<ItemProps | null> {
    return null as any;
  }

  arrayToFind(items: ItemProps[]) {
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

  async update(id: number, type: MovieDbTypeEnum) {
    const newData = await client.dataForUpdate(id, type);

    const result = await itemSchema.updateOne({ id_db: id, type }, { ...newData });

    return result;

    // maybe not working
  }

  async updateAll() {
    const docs = await api.find({});
    let finished = [];
    let errors = [];

    for (const index in docs) {
      try {
        const { id_db, type } = docs[index];

        const newData = await client.dataForUpdate(id_db, type);

        await itemSchema.updateOne({ id_db, type }, { ...newData });
        finished.push(index);
      } catch (error) {
        errors.push(index);
      }
    }
  }

  async discoverTabs() {}
}

export const api = new Api();

export default api;
