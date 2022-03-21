import { sortByKey } from '@m2vi/iva';
import { ItemProps, SimilarityConfig } from '@utils/types';
import * as mainHelper from '../helper/main';
import backend from '@utils/backend/api';
import get from 'lodash/get';
import has from 'lodash/has';

export class Helper {
  main: mainHelper.Helper;
  defaultConfig: SimilarityConfig;

  constructor() {
    this.main = mainHelper.helper;
    this.defaultConfig = {
      weighting: {
        keywords: 1,
        genre_ids: 0.8,
        credits: 1,
        origin: 0.75,
        collection: 0.8,
      },
    };
  }

  sortByScore(array: ItemProps[]) {
    return sortByKey(array, 'similarity_score');
  }

  removeOriginalItem(item: Partial<ItemProps>, array: ItemProps[]) {
    var index = array.findIndex((i) => this.main.sumId(item) === this.main.sumId(i));
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }

  async getCollection(initialItem: Partial<ItemProps>) {
    return this.removeOriginalItem(initialItem, (await backend.cachedItems()).items);
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
}

export const helper = new Helper();
export default helper;
