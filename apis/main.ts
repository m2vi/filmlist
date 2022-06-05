import { basicFetch } from '@helper/fetch';
import {
  getCertificate,
  getReleaseConfig,
  getTrailers,
  getTranslationFromBase,
  getUniqueListBy,
  getWatchProvidersFromBase,
  isMovie,
  isValidId,
  isValidType,
} from '@helper/main';
import { removeEmpty, sortByKey, stringToBoolean } from '@m2vi/iva';
import { Filter, RawDetails } from '@Types/info';
import {
  BaseResponse,
  FilmlistGenres,
  FilmlistProductionCompany,
  FindOneOptions,
  FindOptions,
  FrontendItemProps,
  GetBaseOptions,
  GetOptions,
  GetTabProps,
  GetTabResponse,
  ItemProps,
  MovieDbTypeEnum,
  PersonsCredits,
  PurposeType,
  TabsType,
} from '@Types/items';
import sift from 'sift';
import info from './info';
import mongodb from './mongodb';
import filter from 'lodash/filter';
import { ProviderProps } from '@Types/justwatch';
import tmdb from './tmdb';
import imdb from './imdb';
import rt from './rt';
import ratings from './ratings';
import convert from './convert';
import user from './user';
import { FilterProps, UserProps } from '@Types/user';
import cache from './cache';
import shuffle from 'lodash/shuffle';
import find from 'lodash/find';
import sample from 'lodash/sample';
import genres from './genres';
import attr from './attr';

class Main {
  async getBase(id: number, type: MovieDbTypeEnum, options?: GetBaseOptions): Promise<BaseResponse> {
    const params = {
      id,
      language: 'en-GB',
      include_image_language: 'en,de,null',
      append_to_response: 'credits,watch/providers,external_ids,videos,images,translations,release_dates,content_ratings,keywords',
    };

    const tmdb_item: any = await tmdb.get(params, isMovie(type) ? MovieDbTypeEnum['movie'] : MovieDbTypeEnum['tv']);
    const [imdb_item, rt_item, imdb_keywords] = !options?.fast
      ? await Promise.all([
          imdb.get(tmdb_item?.external_ids?.imdb_id),
          rt.find({ name: tmdb_item.title ? tmdb_item.title : tmdb_item.name, type, year: new Date(tmdb_item.release_date).getFullYear() }),
          imdb.keywords(tmdb_item?.external_ids?.imdb_id),
        ])
      : [null, null, []];

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
      imdb_keywords,
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

  async findOne({ filter }: FindOneOptions, client: UserProps): Promise<ItemProps | null> {
    await mongodb.init();
    const item = await mongodb.itemSchema.findOne(filter).lean<ItemProps>();
    if (!item) return null;

    return user.appendUserAttributes([mongodb.removeId(item)], client)?.[0];
  }

  private async getCachedItems(purpose: PurposeType) {
    switch (purpose) {
      case 'items_f':
        return await cache.get<ItemProps[]>('items_f');
      case 'items_l':
        return await cache.get<ItemProps[]>('items_l');

      default:
        return await cache.get<ItemProps[]>('items');
    }
  }

  async find({ filter, sort, slice, shuffle: shuffleO = false, purpose }: FindOptions, client: UserProps): Promise<ItemProps[]> {
    let items = await this.getCachedItems(purpose);
    filter = { ...Object.freeze({ ...filter }) };

    items = user.appendUserAttributes(items, client).filter(sift(filter));

    items = sort?.key ? sortByKey(items, sort?.key) : items;
    items = sort?.order === -1 ? items.reverse() : items;

    items = shuffleO ? shuffle(items) : items;

    items = items.slice(slice?.[0], slice?.[1]).reverse();

    return mongodb.removeId(items);
  }

  async local_items() {
    await mongodb.init();
    const scan: RawDetails[] = (await mongodb.flGuiS.findOne().lean<any>())?.scan;
    const items = await mongodb.itemSchema.find().select(attr.items_f).lean<ItemProps[]>();

    let res: ItemProps[] = [];

    for (const index in scan) {
      const details = scan[index];
      const filter = { id: details.id, type: isMovie(details.type) ? 1 : 0 };
      const item = items.find(({ id_db, type }) => id_db === filter.id && type === filter.type);

      if (!item) {
        console.log(details);
        continue;
      }

      res.push({
        ...item,
        details: details,
      });
    }

    return sortByKey(res, 'name');
  }

  async f_local_items(locale: string) {
    const items = await cache.get<ItemProps[]>('items_local');

    return convert.prepareForFrontend(items, locale);
  }

  async providers(): Promise<ProviderProps[]> {
    await mongodb.init();
    const data = await mongodb.itemSchema.find().select('watchProviders').lean<ItemProps[]>();

    let providers: ProviderProps[] = [];

    for (let i = 0; i < data.length; i++) {
      const { watchProviders } = data[i];
      if (!watchProviders) continue;

      for (let i = 0; i < watchProviders.length; i++) {
        const { provider_id, provider_name, logo_path } = watchProviders[i];

        providers.push({ id: provider_id, name: provider_name, logo_path });
      }
    }

    const unique = getUniqueListBy(providers, 'id');

    for (let i = 0; i < unique.length; i++) {
      const provider = unique[i];

      const items = sortByKey(filter(data, sift({ 'watchProviders.provider_id': provider.id })), 'popularity').reverse();

      unique[i] = { ...provider, items: items.length };
    }

    return sortByKey(unique, 'items').reverse();
  }

  async productionCompanies() {
    await mongodb.init();
    const data = await mongodb.itemSchema.find().select('production_companies backdrop_path popularity').lean<ItemProps[]>();
    let companies: FilmlistProductionCompany[] = [];

    for (let i = 0; i < data.length; i++) {
      const { production_companies } = data[i];
      if (!production_companies) return;
      for (let i = 0; i < production_companies.length; i++) {
        const c = production_companies[i];

        companies.push(c);
      }
    }

    companies = getUniqueListBy(companies, 'id');

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];

      const items = sortByKey(filter(data, sift({ 'production_companies.id': company.id })), 'popularity').reverse();

      companies[i] = { ...company, backdrop_path: items[0]?.backdrop_path?.en! ? items[0]?.backdrop_path?.en! : null, items: items.length };
    }

    return sortByKey(companies, 'items').reverse();
  }

  private async getTabConfig(name: string) {
    const tabs = await cache.get<TabsType>('tabs');

    if (!tabs[name]) return {};

    return tabs[name]!;
  }

  async getTab({
    user: user_id,
    tab,
    locale,
    start,
    end,
    custom_config = {},
    purpose,
    shuffle = false,
  }: GetTabProps): Promise<GetTabResponse> {
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;

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
        shuffle,
        purpose,
      },
      client
    );

    items = convert.prepareForFrontend(items, locale).reverse();

    return {
      key: tab,
      length: items.length,
      items: items,
      query: removeEmpty({
        user: typeof user_id === 'string' ? user_id : user_id.identifier,
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
    const items = await cache.get<ItemProps[]>('items');
    let itemsWP = [] as ItemProps[];

    const info = await tmdb.api.personInfo({ id, language: locale, append_to_response: 'external_ids' });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (find(item.credits?.cast!, { id }) || find(item.credits?.crew!, { id })) {
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

  async persons(): Promise<PersonsCredits> {
    await mongodb.init();
    const items = await mongodb.itemSchema.find().select('credits');
    let credits = [] as PersonsCredits;

    for (let i = 0; i < items.length; i++) {
      const { credits: base } = items[i];

      if (!base) continue;

      for (let i = 0; i < base?.cast.length!; i++) {
        if (!base?.cast?.[i]?.id) continue;

        const { id, name, profile_path, popularity } = base?.cast?.[i]!;

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }

      for (let i = 0; i < base?.crew.length!; i++) {
        if (!base?.cast?.[i]?.id) continue;
        const { id, name, profile_path, popularity } = base?.crew?.[i]!;

        credits.push({ id: id!, name: name!, profile_path: profile_path!, popularity: popularity! });
      }
    }

    return getUniqueListBy(sortByKey(credits, 'popularity').reverse(), 'name');
  }

  async genres(): Promise<FilmlistGenres> {
    await mongodb.init();
    const data = await mongodb.itemSchema.find().select('genre_ids backdrop_path ratings').lean<ItemProps[]>();
    let g: FilmlistGenres = [];
    const base = genres.array;

    for (let i = 0; i < base.length; i++) {
      const { id, name, ...props } = base[i];

      const items = sortByKey(filter(data, sift({ genre_ids: id })), 'ratings.tmdb.vote_count').reverse();
      const backdrop_path = sample(items.slice(0, 50))?.backdrop_path?.en;

      g.push({
        id: id,
        name: name.toLowerCase(),
        backdrop_path: backdrop_path ? backdrop_path : null,
        items: items.length,
        ...props,
      });
    }

    return sortByKey(g, 'key');
  }

  async insert(id_db: string | number, type: string | number) {
    const filter: Partial<ItemProps> = { id_db: parseInt(id_db.toString()), type: isMovie(type.toString()) ? 1 : 0 };

    await mongodb.init();

    if (await mongodb.itemSchema.exists(filter)) throw Error('Already exists');
    const data = await this.get(filter.id_db!, filter.type!);

    const doc = new mongodb.itemSchema(data);
    const result = await doc.save();

    return result;
  }

  async delete(id_db: string | number, type: string | number) {
    const filter: Partial<ItemProps> = { id_db: parseInt(id_db.toString()), type: isMovie(type.toString()) ? 1 : 0 };

    const result = await mongodb.itemSchema.deleteOne(filter);

    return result;
  }

  async getMany(client: UserProps, filters: Partial<FilterProps>[], purpose: PurposeType = 'items', _convert: boolean, locale = 'en') {
    if (!Array.isArray(filters) || filters.length <= 0) throw Error('User input malformed (array-c)');

    const arr = filters
      .filter((item) => (isValidType(item.type) && isValidId(item.id)) || item.imdb_id)
      .map((item) => {
        if (item.imdb_id) {
          return {
            'external_ids.imdb_id': item.imdb_id.trim(),
          };
        } else {
          return {
            id_db: parseInt(item.id as any),
            type: isMovie(item.type) ? 1 : 0,
          };
        }
      });

    if (arr.length <= 0) throw Error('User input malformed (filter-c)');

    const items = await this.find(
      {
        filter: { $or: arr },
        purpose: purpose ? (purpose.toString() as any) : 'items',
        sort: {
          key: `name.${locale ? locale.toString() : 'en'}`,

          order: 1,
        },
        slice: [0, Number.MAX_SAFE_INTEGER],
      },
      client
    );

    return convert ? convert.prepareForFrontend(items, locale.toString()) : items;
  }

  async update(id: number, type: MovieDbTypeEnum) {
    const filter = { id_db: id, type: isMovie(type) ? 1 : 0 };

    await mongodb.itemSchema.updateOne(filter, await this.get(filter.id_db, filter.type));
  }

  async updateAll() {
    await mongodb.init();
    const items = await cache.refresh<ItemProps[]>('items_m');

    for (let index = 0; index < items.length; index++) {
      const { id_db, type } = items[index];
      if (!id_db || typeof type === 'undefined') continue;

      await this.update(id_db, type);

      console.log((index + 1) / items.length);
    }
  }
}

export const main = new Main();
export default main;
