import { Connection, FilterQuery, ObjectId, Schema } from 'mongoose';
import { connectToDatabase } from '../database';
import { removeArray, shuffle, sortByKey } from '../array';
import tabs from '@data/tabs.json';
import itemSchema from '@models/itemSchema';
import _, { filter } from 'underscore';
import { FrontendItemProps, GenreProps, InsertProps, ItemProps, MovieDbTypeEnum, Tabs } from '../types';
import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import client from '@utils/themoviedb/api';
import genres from '@utils/themoviedb/genres';
import { isReleased } from '@utils/utils';
import config from '@data/config.json';

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
    this.genres = genres.array;
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

  async getTab({ tab, locale, sort, start, end }: { tab: string; locale: string; sort?: string; start: number; end: number }) {
    const db = await this.init();
    const filter = this.getFilterFromTab(tab);
    const items = await this.find(filter);

    return this.prepareForFrontend(items, locale, sort, start, end);
  }

  toFrontendItem({ _id, genre_ids, name, poster_path, release_date }: ItemProps, locale: string = 'en'): FrontendItemProps {
    return {
      _id: _id ? _id.toString() : null,
      genre_ids: genre_ids ? genre_ids : [],
      name: name[locale] ? name[locale] : 'Invalid',
      poster_path: poster_path[locale] ? poster_path[locale] : null,
      release_date: release_date ? release_date : Date.now(),
    };
  }

  prepareForFrontend(
    items: ItemProps[] = [],
    locale: string = 'en',
    sortKey: string | null = 'name',
    start: number = 0,
    end: number = 50,
    reverse: boolean = false,
    only_unreleased: boolean = false
  ): ItemProps[] {
    const mapped = items.map((item) => this.toFrontendItem(item, locale));
    const sorted = !sortKey ? mapped.reverse() : sortByKey(mapped, sortKey);
    const leased = only_unreleased ? sorted.filter(({ release_date }) => !isReleased(release_date)) : sorted;
    const ersed = reverse ? leased.reverse() : leased;
    const sliced = ersed.slice(start, end);

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

    const genreStats = (collection: any[]) => {
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
        anime: find({}).filter((base) => client.isAnime(base)).length,
        genresWithLessThanTwentyItems: await this.getGenresWithLessThanNItems(20),
      },
      genres: {
        both: genreStats(await itemSchema.find().lean<ItemProps[]>()),
        movies: genreStats(await itemSchema.find({ type: 1 }).lean<ItemProps[]>()),
        tv: genreStats(await itemSchema.find({ type: 0 }).lean<ItemProps[]>()),
      },
      tabs: tabStats(),
    };
  }

  async update(id: number, type: MovieDbTypeEnum) {
    const newData = await client.dataForUpdate(id, type);

    const result = await itemSchema.updateOne({ id_db: id, type }, { ...newData });

    return result;
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

  async getGenresWithLessThanNItems(n: number = 20) {
    const items = await this.find({});
    const { ids } = genres;
    let result = [] as number[];

    for (const id_index in ids) {
      const id = ids[parseInt(id_index)];

      const filtered = items.filter(({ genre_ids }) => genre_ids?.includes(id));
      if (filtered.length < n) {
        result.push(id);
      }
    }

    return result;
  }

  getBrowseGenres(items: ItemProps[] = [], locale: string = 'en') {
    const { ids } = genres;
    const shuffled = shuffle(removeArray(ids, config.hideGenresFromBrowse));
    let entries = {} as any;

    for (const id_index in shuffled) {
      const id = ids[id_index];
      const name = genres.getName(id);
      const filtered = items.filter(({ genre_ids }) => genre_ids?.includes(id));
      if (filtered.length < 20) continue;
      const newItems = this.prepareForFrontend(shuffle(filtered), locale, null, 0, 20);

      entries[name] = {
        length: newItems.length,
        name: name,
        route: `/genre/${id}`,
        items: newItems,
      };
    }

    return entries;
  }

  async getBrowse(locale?: string) {
    const items = await this.find({});
    const moviedbtabs = await client.getTabs();

    const myList = this.prepareForFrontend(_.filter(items, { watched: false }), locale, null, 0, 20);
    const newI = this.prepareForFrontend(items, locale, null, 0, 20);
    const comingSoon = this.prepareForFrontend(items, locale, 'release_date', 0, 20, false, true);

    return {
      myList: {
        length: myList.length,
        name: 'My List',
        route: '/my-list',
        items: myList,
      },
      new: {
        length: newI.length,
        name: 'New',
        route: '/new',
        items: newI,
      },
      ...moviedbtabs,
      comingSoon: {
        length: comingSoon.length,
        name: 'Coming Soon',
        route: '/soon',
        items: comingSoon,
      },
      ...this.getBrowseGenres(items, locale),
    };
  }
}

export const api = new Api();

export default api;
