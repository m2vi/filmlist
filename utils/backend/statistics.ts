import { sortByKey } from '@m2vi/iva';
import { ItemProps } from '@utils/types';
import api from './api';
import helper from '../helper/main';

class Stats {
  async cast() {
    await helper.dbInit();
    const collection = await api.schema.find().select('credits').lean<ItemProps[]>();

    const cast = [] as string[];
    let stats = {} as any;

    collection.forEach((item) => {
      item.credits?.cast.forEach(({ original_name }) => {
        cast.push(original_name);
      });
    });

    cast.forEach((actor) => {
      stats[actor] = cast.filter((name) => name === actor).length;
    });

    const array = Object.entries(stats).map(([member, count]) => {
      return {
        value: member as string,
        count: count as number,
      };
    });

    return sortByKey(array, 'count')
      .reverse()
      .filter(({ count }) => count > 1);
  }

  async keywords() {
    const { items: collection } = await api.cachedItems();

    const keywords = [] as string[];
    let stats = {} as any;

    collection.forEach((item) => {
      item.keywords.forEach(({ name }) => {
        keywords.push(name);
      });
    });

    keywords.forEach((name) => {
      stats[name] = keywords.filter((keyword) => keyword === name).length;
    });

    const array = Object.entries(stats).map(([keyword, count]) => {
      return {
        value: keyword,
        count: count,
      };
    });

    return sortByKey(array, 'count').reverse();
  }

  async stats(small?: boolean) {
    const start = performance.now();
    const db = await helper.dbInit();
    const collection = await api.find({});
    const find = api.arrayToFind(collection);

    const genreStats = (collection: any[]) => {
      let genres = {} as any;

      api.genres.forEach(({ id, name }) => {
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
        genresWithLessThanTwentyItems: await api.getGenresWithLessThanNItems(20),
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
    const db = await helper.dbInit();
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
}

export const stats = new Stats();
export default stats;
