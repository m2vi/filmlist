import {
  BaseResponse,
  CollectionProps,
  FindOneOptions,
  FindOptions,
  GetBaseOptions,
  GetCollectionProps,
  GetOptions,
  GetTabProps,
  GetTabResponse,
  PersonsCredits,
} from '@Types/filmlist';
import { ItemProps, MovieDbTypeEnum, SimpleObject } from '@Types/items';
import { UserProps } from '@Types/user';
import convert from '@utils/convert/main';
import { isMovie } from '@utils/helper/tmdb';
import _ from 'underscore';
import imdb from '../imdb';
import ratings from '../ratings';
import rt from '../rt';
import tmdb from '../tmdb';
import { getCertificate, getTrailers } from '../tmdb/helper';
import {
  getAverageRatingFromItems,
  getReleaseConfig,
  getTranslationFromBase,
  getWatchProvidersFromBase,
  reduceNumArray,
  collectionGenreIds,
} from './helper';
import cache from '../cache';
import sift from 'sift';
import { removeEmpty, sortByKey } from '@m2vi/iva';
import user from '@utils/user';
import db from '@utils/db/main';
import { getUniqueListBy } from '@utils/helper';

class Filmlist {
  async getBase(id: number, type: MovieDbTypeEnum, options?: GetBaseOptions): Promise<BaseResponse> {
    const params = {
      id,
      language: 'en-GB',
      include_image_language: 'en,de,null',
      append_to_response: 'credits,watch/providers,external_ids,videos,images,translations,release_dates,content_ratings,keywords',
    };

    const tmdb_item: any = await tmdb.get(params, isMovie(type) ? MovieDbTypeEnum['movie'] : MovieDbTypeEnum['tv']);
    const [imdb_item, rt_item] = !options?.fast
      ? await Promise.all([
          imdb.get(tmdb_item?.external_ids?.imdb_id),
          rt.find({ name: tmdb_item.title ? tmdb_item.title : tmdb_item.name, type, year: new Date(tmdb_item.release_date).getFullYear() }),
        ])
      : [null, null];

    return {
      tmdb_item,
      rt_item,
      imdb_item,
      translation_de: getTranslationFromBase(tmdb_item, tmdb_item?.translations, tmdb_item?.images),
      trailers: getTrailers(tmdb_item?.videos),
      certificate: getCertificate(tmdb_item, isMovie(type)),
      watchProviders: getWatchProvidersFromBase(tmdb_item?.['watch/providers']),
      ratings: ratings.getRatingsFromBase(tmdb_item, imdb_item, rt_item),
      isMovie: isMovie(type),
    };
  }

  async get(id: number, type: MovieDbTypeEnum, options?: GetOptions) {
    const base = await this.getBase(id, type, options);

    return convert.fromBaseToItem(base);
  }

  async getFast(id: number, type: MovieDbTypeEnum, user_id: string) {
    const client = await user.find(user_id);
    const db_item = await this.findOne({ filter: { id_db: id, type: isMovie(type) ? 1 : 0 } }, client);

    if (db_item) {
      return db_item;
    } else {
      return await this.get(id, type, { fast: true });
    }
  }

  /*   async exists({ filter }: FindOneOptions): Promise<Boolean> {
    return Boolean(await this.findOne({ filter }));
  } */

  async findOne({ filter }: FindOneOptions, client: UserProps): Promise<ItemProps | null> {
    const items = await cache.items.get();

    const result = user.appendUserAttributes(items, client).find(sift(filter));

    return result ? db.removeId(result) : null;
  }

  async find({ filter, sort, slice }: FindOptions, client: UserProps): Promise<ItemProps[]> {
    let items = await cache.items.get();
    filter = { ...Object.freeze({ ...filter }) };

    items = user.appendUserAttributes(items, client).filter(sift(filter));

    items = sort?.key ? sortByKey(items, sort?.key) : items;
    items = sort?.order === 1 ? items.reverse() : items;

    items = items.slice(slice?.[0], slice?.[1]).reverse();

    return db.removeId(items);
  }

  private async getTabConfig(name: string) {
    const tabs = await cache.tabs.get();

    if (!tabs[name]) return {};

    return tabs[name]!;
  }

  async getTab({ user: user_id, tab, locale, start, end, custom_config = {}, purpose = 'tab' }: GetTabProps): Promise<GetTabResponse> {
    await db.init();
    const client = await user.find(user_id);

    let items = [];
    const tab_config = await this.getTabConfig(tab);

    const config = { ...tab_config, ...custom_config };
    items = await this.find(
      {
        filter: {
          ...config.filter,
          ...getReleaseConfig({
            ...config,
            release_year: config?.release_year ? config?.release_year : undefined,
          }),
        },
        sort: {
          key:
            typeof config?.sort_key === 'boolean'
              ? 'user_index'
              : typeof config?.sort_key === 'undefined'
              ? `name.${locale}`
              : config?.sort_key,
          order: config?.reverse ? -1 : 1,
        },
        slice: [start ? start : 0, end ? end : 50],
      },
      client
    );

    items = convert.prepareForFrontend(items, locale).reverse();

    return {
      key: tab,
      length: items.length,
      items: items,
      query: removeEmpty({
        user: user_id,
        tab,
        locale,
        start,
        end,
        custom_config,
        purpose,
      }),
    };
  }

  async getPerson(id: number, locale: string = 'en', client: UserProps) {
    const items = await cache.items.get();
    let itemsWP = [] as ItemProps[];

    const info = await tmdb.api.personInfo({ id, language: locale, append_to_response: 'external_ids' });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (_.find(item.credits.cast, { id }) || _.find(item.credits.crew, { id })) {
        itemsWP.push(item);
      }
    }

    return {
      info,
      items: user.appendUserAttributes(
        convert.prepareForFrontend(sortByKey(itemsWP, 'ratings.imdb.vote_count'), locale).reverse().slice(0, 20),
        client
      ),
    };
  }

  async persons(page: number) {
    const items = await cache.items.get();
    let credits = [] as PersonsCredits;

    for (let i = 0; i < items.length; i++) {
      const {
        credits: { cast, crew },
      } = items[i];

      for (let i = 0; i < cast.length; i++) {
        const { id, name, profile_path, popularity } = cast[i];

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }

      for (let i = 0; i < crew.length; i++) {
        const { id, name, profile_path, popularity } = crew[i];

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }
    }

    return getUniqueListBy(sortByKey(credits, 'popularity').reverse(), 'name').slice(page * (8 * 8), page * (8 * 8) + 8 * 8);
  }

  async updateAll() {
    await db.init();
    const items = await cache.items.refresh();

    for (let index = 0; index < items.length; index++) {
      const { id_db, type, name } = items[index];

      await db.itemSchema.updateOne({ id_db, type }, await this.get(id_db, type));

      console.log(name?.en, index);
    }
  }

  async getCollection(id: number, locale: string, client: UserProps): Promise<GetCollectionProps> {
    const data = await tmdb.getCollection({ id, language: locale });

    const local_items = await this.find(
      {
        filter: { 'collection.id': id },
        slice: [0, Number.MAX_SAFE_INTEGER],
        sort: { key: 'release_date', order: -1 },
      },
      client
    );
    const tmdb_items = sortByKey(user.appendUserAttributes(convert.prepareTmdbForFrontend(data.parts!), client), 'release_date');

    return {
      data: {
        id: data.id,
        overview: data.overview,
        name: data.name,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        rating: getAverageRatingFromItems(tmdb_items),
        genre_ids: collectionGenreIds(tmdb_items.map(({ genre_ids }) => genre_ids)),
        local_items: local_items.length,
        tmdb_items: tmdb_items.length,
        local_marathon_length: reduceNumArray(local_items.map(({ runtime }) => (runtime ? runtime : 0))),
      },
      items: tmdb_items,
    };
  }

  async collections(locale: string = 'en'): Promise<CollectionProps[]> {
    await db.init();
    const items = await cache.items.get();
    const c: SimpleObject<CollectionProps> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.collection) continue;
      const { id, name, poster_path, backdrop_path } = item.collection;

      if (c[id]) {
        c[id].items?.push(convert.fromItemToFrontend(item, locale));
        c[id].popularity += item.popularity!;
      } else {
        c[id] = {
          id,
          name,
          poster_path,
          backdrop_path,
          popularity: item.popularity!,
          items: [convert.fromItemToFrontend(item)],
        };
      }
    }

    return sortByKey(
      Object.entries(c).map(([key, value]) => value),
      'popularity'
    ).reverse();
  }
}

export const filmlist = new Filmlist();
export default filmlist;
