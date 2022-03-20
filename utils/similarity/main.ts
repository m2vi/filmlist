import { ItemProps, SimilarityConfig, SimilarityResultObject } from '@utils/types';
import { boolToNum } from '@utils/utils';
import get from 'lodash/get';
import helper from './helper';

class Main {
  addWeight(similarity: number, weight: number): number {
    return similarity * weight;
  }

  //! FIX
  weight(similarity: SimilarityResultObject, parsedConfig: SimilarityConfig): number {
    let configWeighting = [] as any[];
    const weighted = Object.entries(similarity).map(([key, value]) => {
      const weight = get(parsedConfig?.weighting!, key) ? get(parsedConfig?.weighting!, key) : parsedConfig?.weighting?.credits;

      configWeighting.push(weight);

      return this.addWeight(Number.isNaN(value) ? 0 : value, weight);
    });

    const parsedWeights = weighted.reduce((prev, curr) => prev + curr, 0);

    const divideWith = 4.8;

    return parseFloat(parsedWeights.toPrecision(12));
  }

  getIntersection<T>(array1: T[], array2: T[]): T[] {
    return array1.filter((element) => array2.includes(element));
  }

  calculateOriginSimilarity(item: ItemProps, item2: ItemProps): number {
    return boolToNum(item.original_language === item2.original_language);
  }

  calculateKeywordsSimilarity(item1: ItemProps, item2: ItemProps): number {
    return this.getIntersection(item1.keywords, item2.keywords).length / item1.keywords.length ? item1.keywords.length : 1;
  }

  calculateGenreIDsSimilarity(item1: ItemProps, item2: ItemProps): number {
    return this.getIntersection(item1.genre_ids, item2.genre_ids).length / item1.genre_ids.length;
  }

  calculateCollectionSimilarity(item1: ItemProps, item2: ItemProps): number {
    const collection1 = item1.collection?.id;
    const collection2 = item2.collection?.id;

    return boolToNum(collection1 === collection2);
  }

  calculateCastSimilarity(item1: ItemProps, item2: ItemProps): number {
    const cast1 = (item1?.credits?.cast ? item1?.credits?.cast : []).slice(0, 5).map(({ original_name }) => original_name);
    const cast2 = (item2?.credits?.cast ? item2?.credits?.cast : []).slice(0, 5).map(({ original_name }) => original_name);

    const result = this.getIntersection(cast1, cast2).length / item1.credits?.cast?.slice(0, 5)?.length!;

    return Number.isNaN(result) ? 0 : result;
  }

  calculateCrewSimilarity(item1: ItemProps, item2: ItemProps): number {
    //! FIX CAUSE BAD
    const crew1 = (item1?.credits?.crew ? item1?.credits?.crew : []).map(({ original_name }) => original_name);
    const crew2 = (item2?.credits?.crew ? item2?.credits?.crew : []).map(({ original_name }) => original_name);

    const result = this.getIntersection(crew1, crew2).length / item1.credits?.crew?.length!;

    return Number.isNaN(result) ? 0 : result;
  }

  calculateSimilarity(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const parsed = helper.parseConfig(config);

    const origin = this.calculateOriginSimilarity(item1, item2);
    const keywords = this.calculateKeywordsSimilarity(item1, item2);
    const genre_ids = this.calculateGenreIDsSimilarity(item1, item2);
    const cast = this.calculateCastSimilarity(item1, item2);
    const crew = this.calculateCrewSimilarity(item1, item2);
    const collection = this.calculateCollectionSimilarity(item1, item2);

    const weighted = this.weight({ origin, keywords, genre_ids, cast, crew, collection }, parsed);

    return weighted;
  }
}

export const similarity = new Main();
export default similarity;
