import { Connection, FilterQuery, UpdateQuery } from 'mongoose';
import { connectToDatabase } from '../database';
import { removeDuplicates, sortByKey } from '../array';
import tabs from '@data/tabs.json';
import itemSchema from '@models/itemSchema';
import _, { sortBy } from 'underscore';
import { FrontendItemProps, GenreProps, GetBrowseGenreProps, GetTabProps, InsertProps, ItemProps, MovieDbTypeEnum, Tabs } from '../types';
import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import client from '@utils/themoviedb/api';
import genres from '@utils/themoviedb/genres';
import { isReleased, removeEmpty } from '@utils/utils';
import { performance } from 'perf_hooks';
import shuffle from 'shuffle-seed';
import seedRandom from 'seed-random';
import tmdb from '@utils/themoviedb/api';

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

  async getTab({ tab, locale, start, end, includeCredits, dontFrontend, release_year, custom_config, purpose = 'tab' }: GetTabProps) {
    if (tab === 'trends') return await tmdb.getTrends(locale);
    let items = [];
    let extra = null;
    const config = custom_config ? custom_config : this.getTabConfig(tab);
    await this.init();
    items = await this.find(config?.filter ? config?.filter : {}, config?.includeCredits || includeCredits);

    if (typeof config?.sort_key === 'boolean') {
    } else if (typeof config?.sort_key === 'undefined') {
      items = sortByKey(items, `name.${locale}`).reverse();
    } else if (config?.sort_key) {
      items = sortByKey(items, config?.sort_key);
    }

    items = items.filter(({ release_date }) => {
      if (
        (release_year || config?.release_year) &&
        !(new Date(release_date).getFullYear().toString() === (release_year || config?.release_year))
      )
        return false;
      if (config?.hide_unreleased && !isReleased(release_date)) return false;
      if (config?.only_unreleased && isReleased(release_date)) return false;

      return true;
    });

    items = config?.reverse ? items.reverse() : items;
    items = dontFrontend ? items : this.prepareForFrontend(items, locale);

    return {
      name: tab,
      route: `/${tab}`,
      length: items.length,
      items: items.slice(start, end),
      extra: extra ? extra : null,
      query: removeEmpty({
        tab,
        locale,
        start,
        end,
        includeCredits,
        dontFrontend,
        release_year,
        custom_config,
        purpose,
      }),
    };
  }

  async getCompanyItems({ id, locale, page }: { id: number; locale: string; page: number }) {
    try {
      const raw = (await client.api.discoverMovie({ with_companies: id.toString(), language: locale, page: page + 1 }))?.results;
      if (!raw) return [];

      return this.prepareForFrontend(raw as any, locale);
    } catch (error: any) {
      return [];
    }
  }

  toFrontendItem(
    {
      _id,
      state,
      name,
      poster_path,
      release_date,
      backdrop_path,
      id_db,
      title,
      first_air_date,
      vote_average,
      vote_count,
      type,
      genres,
      genre_ids,
      ratings,
      watchProviders,
      ...props
    }: any,
    locale: string = 'en'
  ): FrontendItemProps {
    return {
      _id: _id ? _id.toString() : null,
      id_db: id_db ? id_db : null,
      genre_ids: genre_ids ? genre_ids : genres ? genres : [],
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
      ratings: ratings ? ratings : null,
      type,
      state: state ? state : 0,
      watchProviders: watchProviders ? watchProviders : null,
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

  prepareForFrontend(items: ItemProps[] = [], locale: string = 'en'): FrontendItemProps[] {
    const mapped = items.map((item) => this.toFrontendItem(item, locale)).reverse();

    return mapped;
  }

  async find(filter: FilterQuery<ItemProps>, includeCredits: boolean = false): Promise<ItemProps[]> {
    await this.init();
    let items = [];

    if (includeCredits) {
      items = await itemSchema.find(Object.freeze({ ...filter })).lean<any>();
    } else {
      items = await itemSchema
        .find(Object.freeze({ ...filter }))
        .select('-credits')
        .lean<any>();
    }

    return items;
  }

  async findOne(filter: FilterQuery<ItemProps>, includeCredits: boolean = false): Promise<ItemProps> {
    await this.init();
    let item = [];

    if (includeCredits) {
      item = await itemSchema.findOne(Object.freeze({ ...filter })).lean<any>();
    } else {
      item = await itemSchema
        .findOne(Object.freeze({ ...filter }))
        .select('-credits')
        .lean<any>();
    }

    return item;
  }

  async findCollection(id_db: number, locale: string) {
    const { id, name, poster_path, backdrop_path, overview, parts } = await client.api.collectionInfo({ id: id_db, language: locale });
    const local = await this.find({ 'collection.id': id_db });
    const items = sortByKey(
      this.prepareForFrontend(await client.adaptTabs(client.getTabeBase(parts, parts)), locale),
      'release_date'
    ).reverse();

    return {
      id,
      name,
      overview,
      poster_path,
      genre_ids: removeDuplicates(items.reduce((prev, { genre_ids }) => prev.concat(genre_ids), [] as number[])),
      backdrop_path: backdrop_path,
      local_count: local?.length,
      tmdb_count: parts?.length,
      vote_average: client.getAverageRating(parts as any),
      items,
    };
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

    return Object.entries(collections).map(([name, value]: any) => value);
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

    if (!small) {
      return {
        general: {
          entries: collection?.length,
          movies: find({ type: 1 }).length,
          tv: find({ type: 0 }).length,
          'my list': find({ state: -1 }).length,
        },
        genres: genreStats(collection),
        tabs: null,
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

  async getBrowseGenre({ locale = 'en', seed, index }: GetBrowseGenreProps) {
    const rng = seedRandom(seed);
    const { browseIds } = genres;
    const id = shuffle.shuffle(browseIds, rng())[index];
    const tab = await this.getTab({
      tab: '',
      locale,
      start: 0,
      end: 20,
      purpose: 'browse',
      custom_config: {
        hide_unreleased: true,
        filter: {
          genre_ids: id,
        },
      },
    });

    return {
      length: tab.length,
      name: genres.getName(id),
      route: `/genre/${id}`,
      items: shuffle.shuffle(tab.items, rng()),
    };
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

  async manage() {}
}

export const api = new Api();

export default api;
