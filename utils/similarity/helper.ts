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
        genre_ids: 0.5,
        credits: 0,
        origin: 0.25,
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
    return this.removeOriginalItem(initialItem, await cache.items.get());
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
}

export const helper = new Helper();
export default helper;
