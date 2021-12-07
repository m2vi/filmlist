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
import { isReleased, someIncludes } from '@utils/utils';
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

  private getTabConfig(name: string) {
    if (!this.tabs[name]) return null;

    return this.tabs[name]!;
  }

  async getTab(
    {
      tab,
      locale,
      start,
      end,
      includeGenres,
    }: {
      tab: string;
      locale: string;
      start: number;
      end: number;
      includeGenres?: number;
    },
    default_items?: ItemProps[]
  ) {
    let items = [];
    const config = this.getTabConfig(tab);

    if (default_items) {
      items = _.filter(default_items, config?.filter ? config?.filter : {});
    } else {
      const db = await this.init();
      items = await this.find(config?.filter ? config?.filter : {});
    }

    if (typeof config?.sort_key === 'boolean') {
    } else if (typeof config?.sort_key === 'undefined') {
      items = sortByKey(items, 'name', locale).reverse();
    } else if (config?.sort_key) {
      items = sortByKey(items, config?.sort_key);
    }

    items = config?.includeGenres
      ? items.filter(({ genre_ids }) => someIncludes(config?.includeGenres, genre_ids))
      : includeGenres
      ? items.filter(({ genre_ids }) => genre_ids.includes(includeGenres))
      : items;
    items = config?.hide_unreleased ? items.filter(({ release_date }) => isReleased(release_date)) : items;

    const result = this.prepareForFrontend(items, locale, null, null, null, config?.reverse, config?.only_unreleased);

    return {
      length: result.length,
      items: result.slice(start, end),
    };
  }

  toFrontendItem({ _id, genre_ids, name, poster_path, release_date, original_name }: ItemProps, locale: string = 'en'): FrontendItemProps {
    return {
      _id: _id ? _id.toString() : null,
      genre_ids: genre_ids ? genre_ids : [],
      name: name[locale] ? name[locale] : 'Invalid name',
      poster_path: poster_path[locale] ? poster_path[locale] : null,
      release_date: release_date ? release_date : Date.now(),
    };
  }

  prepareForFrontend(
    items: ItemProps[] = [],
    locale: string = 'en',
    sortKey: string | null = 'name',
    start: number | null = 0,
    end: number | null = 50,
    reverse: boolean = false,
    only_unreleased: boolean = false
  ): ItemProps[] {
    const mapped = items.map((item) => this.toFrontendItem(item, locale)).reverse();
    const sorted = !sortKey ? mapped : sortByKey(mapped, sortKey);
    const leased = only_unreleased ? sorted.filter(({ release_date }) => !isReleased(release_date)) : sorted;
    const ersed = reverse ? leased.reverse() : leased;
    const sliced = !end || !start ? ersed : ersed.slice(start, end);

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
    const newData: any = await client.dataForUpdate(id, type);

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

        const newData: any = await client.dataForUpdate(id_db, type);

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
    const shuffled = shuffle(ids);
    let entries = {} as any;

    for (const id_index in shuffled) {
      if (entries.length >= 3) continue;
      const id = ids[id_index];
      const name = genres.getName(id);
      const filtered = items.filter(({ genre_ids }) => genre_ids?.includes(id));
      if (filtered.length < 20) continue;
      if (Object.entries(entries).length >= 3) continue;

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

    const myList = (await this.getTab({ tab: 'my list', locale: locale!, start: 0, end: 20 }, items)).items;
    const newI = (await this.getTab({ tab: 'new', locale: locale!, start: 0, end: 20 }, items)).items;
    const soon = (await this.getTab({ tab: 'soon', locale: locale!, start: 0, end: 20 }, items)).items;
    const recently = (await this.getTab({ tab: 'recently released', locale: locale!, start: 0, end: 20 }, items)).items;

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
        route: '/latest',
        items: newI,
      },
      ...moviedbtabs,
      comingSoon: {
        length: soon.length,
        name: 'Coming Soon',
        route: '/soon',
        items: soon,
      },
      recentlyReleased: {
        length: recently.length,
        name: 'Recently Released',
        route: '/recently',
        items: recently,
      },
      ...this.getBrowseGenres(items, locale),
    };
  }
}

export const api = new Api();

export default api;
