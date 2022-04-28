import { sortByKey } from '@m2vi/iva';
import { ItemProps } from '@Types/items';
import { SimilarityConfig } from '@Types/similarity';
import cache from '@utils/apis/cache';
import { sumId } from '@utils/helper';
import get from 'lodash/get';
import has from 'lodash/has';

export class Helper {
  defaultConfig: SimilarityConfig;

  constructor() {
    this.defaultConfig = {
      weighting: {
        keywords: 2,
        genre_ids: 1,
        credits: 1,
        origin: 0.5,
        collection: 0,
      },
    };
  }

  sortByScore(array: ItemProps[]) {
    return sortByKey(array, 'similarity_score');
  }

  removeOriginalItem(item: Partial<ItemProps>, array: ItemProps[]) {
    var index = array.findIndex((i) => sumId(item) === sumId(i));
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  async getCollection(initialItem: Partial<ItemProps>) {
    return this.removeOriginalItem(initialItem, await cache.get('items'));
  }

  parseConfig(config: SimilarityConfig | undefined = {}): SimilarityConfig {
    const parse = (path: string | number | symbol) => {
      return has(config, path) ? get(config, path) : get(this.defaultConfig, path);
    };

    return {
      weighting: {
        keywords: parse('weighting.keywords'),
        genre_ids: parse('weighting.genre_ids'),
        credits: parse('weighting.credits'),
        origin: parse('weighting.origin'),
        collection: parse('weighting.collection'),
        plot: parse('weighting.plot'),
      },
    };
  }

  boolToNum(bool: boolean): number {
    return bool ? 1 : 0;
  }

  track<T>(callback: () => T) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();

    return {
      data: result,
      time: end - start,
    };
  }
}

export const helper = new Helper();
export default helper;
