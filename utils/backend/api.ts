import { Connection, FilterQuery, UpdateQuery } from 'mongoose';
import { connectToDatabase } from '../database';
import { shuffle, sortByKey } from '../array';
import tabs from '@data/tabs.json';
import itemSchema from '@models/itemSchema';
import _, { sortBy } from 'underscore';
import { CreditProps, FrontendItemProps, GenreProps, InsertProps, ItemProps, MovieDbTypeEnum, TabFilterOptions, Tabs } from '../types';
import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import client from '@utils/themoviedb/api';
import genres from '@utils/themoviedb/genres';
import { isReleased, someIncludes } from '@utils/utils';
import { performance } from 'perf_hooks';

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

  deleteStateProperty(filter: Partial<ItemProps> | null): Partial<ItemProps> {
    if (!filter) return {};
    if (!_.has(filter, 'state')) return filter;
    if (!Array.isArray(filter?.state)) return filter;

    return [filter].map(({ state, ...props }) => ({ ...props }))[0];
  }

  prepareConfig(config: TabFilterOptions | null): [TabFilterOptions | null, Function] {
    if (!config) return [{}, (data: any) => data];
    if (!_.has(config, 'filter')) return [config, (data: any) => data];
    if (!Array.isArray(config.filter?.state)) return [config, (data: any) => data];

    return [config, (items: ItemProps[]) => items.filter(({ state }) => (config?.filter?.state as number[])?.includes(state as number))];
  }

  async getTab(
    {
      tab,
      locale,
      start,
      end,
      includeGenres,
      includePerson,
      includeCredits,
      dontFrontend,
    }: {
      tab: string;
      locale: string;
      start: number;
      end: number;
      includeGenres?: number;
      includePerson?: number;
      includeCredits?: boolean;
      dontFrontend?: boolean;
    },
    default_items?: ItemProps[]
  ) {
    let items = [];
    let extra = null;
    const c = this.getTabConfig(tab);
    if (c === null)
      return {
        length: 0,
        items: [],
      };
    let [config, func] = this.prepareConfig(c);

    if (default_items) {
      items = _.filter(default_items, config?.filter ? this.deleteStateProperty(config?.filter) : {});
    } else {
      await this.init();
      items = await this.find(config?.filter ? this.deleteStateProperty(config?.filter) : {}, config?.includeCredits || includeCredits);
    }

    items = func(items) as ItemProps[];

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
    items =
      includePerson && config?.includeCredits
        ? items.filter(({ credits: { cast, crew } }: { credits: CreditProps }) => {
            const both = cast.concat(crew as any);
            const ids = both.map(({ id }) => id);
            if (ids.includes(includePerson)) {
              extra = both.find(({ id }) => id === includePerson);
              return true;
            } else {
              return false;
            }
          })
        : items;
    items = config?.hide_unreleased ? items.filter(({ release_date }) => isReleased(release_date)) : items;

    items =
      typeof config?.minVotes === 'number' ? items.filter(({ vote_count } = { vote_count: 0 }) => vote_count > config?.minVotes!) : items;

    items = dontFrontend ? items : this.prepareForFrontend(items, locale, null, null, null, config?.reverse, config?.only_unreleased);

    return {
      length: items.length,
      extra: extra ? extra : null,
      items: items.slice(start, end),
    };
  }

  async getCompanyItems({ id, locale, page }: { id: number; locale: string; page: number }) {
    try {
      const raw = (await client.api.discoverMovie({ with_companies: id.toString(), language: locale, page: page + 1 }))?.results;
      if (!raw) return [];

      return this.prepareForFrontend(raw as any, locale, null, 0, Number.MAX_SAFE_INTEGER);
    } catch (error: any) {
      return [];
    }
  }

  toFrontendItem(
    { _id, state, name, poster_path, release_date, backdrop_path, id_db, title, first_air_date, vote_average, type }: any,
    locale: string = 'en'
  ): FrontendItemProps {
    return {
      _id: _id ? _id.toString() : null,
      id_db: id_db ? id_db : null,
      name: typeof name === 'object' ? (name[locale] ? name[locale] : 'Invalid name') : name ? name : title,
      poster_path:
        typeof poster_path === 'object' && poster_path !== null ? (poster_path[locale] ? poster_path[locale] : null) : poster_path,
      backdrop_path:
        typeof backdrop_path === 'object' && backdrop_path !== null
          ? backdrop_path[locale]
            ? backdrop_path[locale]
            : null
          : backdrop_path,
      release_date: (release_date ? release_date : first_air_date) ? (release_date ? release_date : first_air_date) : new Date().getTime(),
      vote_average: vote_average ? vote_average : 0,
      type,
      state: state ? state : 0,
    };
  }

  private error(msg: string) {
    return {
      error: msg,
    };
  }

  async moveItemToStart(filter: FilterQuery<ItemProps>) {
    if (!(_.has(filter, 'type') || _.has(filter, 'id_db'))) return this.error('Filter sucks');

    const item = await this.findOne(filter, true);
    await itemSchema.deleteOne(item);
    const doc = new itemSchema(item);
    return await doc.save();
  }

  async deleteOne(filter: FilterQuery<ItemProps>) {
    await this.init();
    if (!(_.has(filter, 'type') || _.has(filter, 'id_db'))) return this.error('Filter sucks');

    if (!(await this.exists(filter))) return this.error('Item does not exist');

    return await itemSchema.deleteOne(filter);
  }

  async deleteMany(filter: FilterQuery<ItemProps>) {
    await this.init();
    if (!(_.has(filter, 'type') || _.has(filter, 'id_db'))) return this.error('Filter sucks');

    return await itemSchema.deleteMany(filter);
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
    const sliced = typeof start === 'number' ? (!(start + 1 && end) ? ersed : ersed.slice(start, end)) : ersed;

    return sliced;
  }

  async find(filter: FilterQuery<ItemProps>, includeCredits: boolean = false): Promise<ItemProps[]> {
    await this.init();
    let items = [];

    if (includeCredits) {
      items = await itemSchema.find({ ...filter }).lean<any>();
    } else {
      items = await itemSchema
        .find({ ...filter })
        .select('-credits')
        .lean<any>();
    }

    return items;
  }

  async findOne(filter: FilterQuery<ItemProps>, includeCredits: boolean = false): Promise<ItemProps> {
    await this.init();
    let item = [];

    if (includeCredits) {
      item = await itemSchema.findOne({ ...filter }).lean<any>();
    } else {
      item = await itemSchema
        .findOne({ ...filter })
        .select('-credits')
        .lean<any>();
    }

    return item;
  }

  async findCollection(name: string) {
    const all = await this.collections(true);
    const current = all[name];

    return current ? current : null;
  }

  async collections(includeCredits: boolean = false) {
    await this.init();
    const items = await this.find(
      {
        collection: {
          $ne: null,
        },
      },
      includeCredits
    );
    let collections = {} as any;

    items.forEach((item) => {
      const { collection } = item;
      if (!collection) return;

      if (collections[collection.name]) {
        collections[collection.name].items.push(item);
      } else {
        collections[collection.name] = {
          id: collection.id,
          name: collection.name,
          poster_path: collection.poster_path,
          backdrop_path: collection.backdrop_path,
          items: [item],
        };
      }
    });

    return collections;
  }

  async exists(filter: FilterQuery<ItemProps>): Promise<boolean> {
    try {
      const item = await this.findOne(filter);

      return item ? true : false;
    } catch (error) {
      return false;
    }
  }

  async insert({ id_db, type, state }: InsertProps): Promise<ItemProps | any> {
    try {
      const exists = await this.exists({ id_db: parseInt(id_db as any), type: MovieDbTypeEnum[type] as any });
      if (exists) return this.error('Already exists');

      const data = await client.get(id_db, type, { state });
      const doc = new itemSchema(data);

      return await doc.save();
    } catch (error: any) {
      return null;
    }
  }

  async insertMany(items: InsertProps[]): Promise<ItemProps | null> {
    return null as any;
  }

  arrayToFind(items: ItemProps[]) {
    return (filter: Partial<ItemProps>) => _.where(items, filter);
  }

  async stats(small?: boolean) {
    const start = performance.now();
    const db = await this.init();
    const collection = await this.find({}, false);
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

    if (!small) {
      return {
        general: {
          entries: collection?.length,
          movies: find({ type: 1 }).length,
          tv: find({ type: 0 }).length,
          'my list': find({ state: -1 }).length,
        },
        genres: genreStats(collection),
        tabs: tabStats(),
        db: await this.dbStats(),
        genresWithLessThanTwentyItems: await this.getGenresWithLessThanNItems(20),
        time: `${(performance.now() - start).toFixed(2)}ms`,
      };
    }
    return {
      general: {
        entries: collection?.length,
        movies: find({ type: 1 }).length,
        tv: find({ type: 0 }).length,
        'my list': find({ state: -1 }).length,
      },
      time: `${(performance.now() - start).toFixed(2)}ms`,
    };
  }

  async dbStats() {
    const start = performance.now();
    const db = await this.init();
    const stats = await db?.db.collection('filmlist').stats();
    if (!stats) return {};
    const { count, ns, size, avgObjSize, storageSize, freeStorageSize } = stats;

    return {
      ns,
      size,
      count,
      avgObjSize,
      storageSize,
      freeStorageSize,
      time: `${(performance.now() - start).toFixed()}ms`,
    };
  }

  async update(id: number, type: MovieDbTypeEnum) {
    const newData: any = await client.dataForUpdate(id, type);

    const result = await itemSchema.updateOne({ id_db: id, type }, { ...newData });

    return result;
  }

  async updateMany(filter: FilterQuery<ItemProps>, data: UpdateQuery<ItemProps>) {
    await this.init();

    const result = await itemSchema.updateMany(filter, data);

    return result;
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

  async getPersons(locale: string, start: number, end: number, default_items?: ItemProps[]) {
    const items = default_items
      ? default_items
      : (
          await this.getTab({
            tab: 'top-rated',
            start: 0,
            end: Number.MAX_SAFE_INTEGER,
            locale,
            includeCredits: true,
            dontFrontend: true,
          })
        ).items;
    let result = {} as any;

    items.forEach(({ credits }: ItemProps) => {
      const c = credits?.cast;

      c?.forEach(({ original_name, profile_path, gender, id, known_for_department }) => {
        if (result[original_name]) {
          result[original_name].items++;
        } else {
          result[original_name] = {
            profile_path,
            items: 1,
          };
        }
      });
    });

    return sortBy(
      Object.entries(result)
        .map(([name, object]: any) => {
          return {
            name,
            ...object,
          };
        })
        .filter((item) => item),
      'items'
    )
      .reverse()
      .slice(start, end)
      .map(({ name, profile_path }) => ({ name, profile_path }));
  }

  async getBrowse(locale?: string) {
    const items = await this.find({});
    const moviedbtabs = await client.getTabs();

    const myList = (await this.getTab({ tab: 'my list', locale: locale!, start: 0, end: 20 }, items)).items;
    const latest = (await this.getTab({ tab: 'latest', locale: locale!, start: 0, end: 20 }, items)).items;
    const soon = (await this.getTab({ tab: 'soon', locale: locale!, start: 0, end: 20 }, items)).items;

    return {
      myList: {
        length: myList.length,
        name: 'My List',
        route: '/my list',
        items: myList,
      },
      latest: {
        length: latest.length,
        name: 'Latest',
        route: '/latest',
        items: latest,
      },
      ...moviedbtabs,
      soon: {
        length: soon.length,
        name: 'soon',
        route: '/soon',
        items: soon,
      },
      ...this.getBrowseGenres(items, locale),
    };
  }

  async backup() {
    await this.init();

    return await itemSchema.find();
  }

  toJSON({ _id, ...props }: any): ItemProps {
    const res = {
      _id: _id?.toString() ? _id?.toString() : null,
      ...props,
    };

    return res;
  }

  async details(type: string, id: number | string, locale: string) {
    let res: any = {
      error: 'Unkown error',
    };
    try {
      res = this.toJSON(await this.findOne({ type: MovieDbTypeEnum[type as any] as any, id_db: parseInt(id as string) }, true));
    } catch (error) {
      try {
        res = this.toJSON(await client.get(parseInt(id as any), MovieDbTypeEnum[type as any] as any, { state: 0 }));
      } catch (error: any) {
        return {
          error: error.message,
        };
      }
    }

    return {
      raw: res,
      frontend: this.toFrontendItem(res, locale),
      subscribedProvider: client.subscribedProvider(res),
    };
  }
}

export const api = new Api();

export default api;
