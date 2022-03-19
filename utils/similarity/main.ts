import { ItemProps, MovieDbTypeEnum, SimilarityConfig, SimilarityResultObject } from '@utils/types';
import { boolToNum } from '@utils/utils';
import get from 'lodash/get';
import has from 'lodash/has';
import tmdb from '@utils/tmdb/api';
import helper from '@utils/helper/main';
import backend from '@utils/backend/api';
import { sortByKey } from '@m2vi/iva';

class Similarity {
  defaultConfig: SimilarityConfig;

  constructor() {
    this.defaultConfig = {
      weighting: {
        keywords: 1,
        genre_ids: 0.9,
        credits: 0.8,
        origin: 0.7,
        collection: 0.8,
      },
    };
  }

  private addWeight(similarity: number, weight: number): number {
    return similarity * weight;
  }

  //! FIX
  private weight(similarity: SimilarityResultObject, parsedConfig: SimilarityConfig): number {
    let configWeighting = [] as any[];
    const weighted = Object.entries(similarity).map(([key, value]) => {
      const weight = get(parsedConfig?.weighting!, key) ? get(parsedConfig?.weighting!, key) : 0.8;

      configWeighting.push(weight);

      return this.addWeight(Number.isNaN(value) ? 0 : value, weight);
    });

    const parsedWeights = weighted.reduce((prev, curr) => prev + curr, 0);

    const divideWith = configWeighting.reduce((prev, curr) => prev + curr, 0) / configWeighting.length;

    return parsedWeights;
  }

  private parseConfig(config: SimilarityConfig | undefined = {}): SimilarityConfig {
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
      },
    };
  }

  private getIntersection<A>(array1: A[], array2: A[]): A[] {
    return array1.filter((element) => array2.includes(element));
  }

  private calculateOriginSimilarity(item: ItemProps, item2: ItemProps): number {
    return boolToNum(item.original_language === item2.original_language);
  }

  private calculateKeywordsSimilarity(item1: ItemProps, item2: ItemProps): number {
    return this.getIntersection(item1.keywords, item2.keywords).length / item1.keywords.length ? item1.keywords.length : 1;
  }

  private calculateGenreIDsSimilarity(item1: ItemProps, item2: ItemProps): number {
    return this.getIntersection(item1.genre_ids, item2.genre_ids).length / item1.genre_ids.length;
  }

  private calculateCollectionSimilarity(item1: ItemProps, item2: ItemProps): number {
    const collection1 = item1.collection?.id;
    const collection2 = item2.collection?.id;

    return boolToNum(collection1 === collection2);
  }

  private calculateCastSimilarity(item1: ItemProps, item2: ItemProps): number {
    const cast1 = (item1?.credits?.cast ? item1?.credits?.cast : []).slice(0, 5).map(({ original_name }) => original_name);
    const cast2 = (item2?.credits?.cast ? item2?.credits?.cast : []).slice(0, 5).map(({ original_name }) => original_name);

    const result = this.getIntersection(cast1, cast2).length / item1.credits?.cast?.slice(0, 5)?.length!;

    return Number.isNaN(result) ? 0 : result;
  }

  private calculateCrewSimilarity(item1: ItemProps, item2: ItemProps): number {
    //! FIX CAUSE BAD
    const crew1 = (item1?.credits?.crew ? item1?.credits?.crew : []).map(({ original_name }) => original_name);
    const crew2 = (item2?.credits?.crew ? item2?.credits?.crew : []).map(({ original_name }) => original_name);

    const result = this.getIntersection(crew1, crew2).length / item1.credits?.crew?.length!;

    return Number.isNaN(result) ? 0 : result;
  }

  private calculateSimilarity(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const parsed = this.parseConfig(config);

    const origin = this.calculateOriginSimilarity(item1, item2);
    const keywords = this.calculateKeywordsSimilarity(item1, item2);
    const genre_ids = this.calculateGenreIDsSimilarity(item1, item2);
    const cast = this.calculateCastSimilarity(item1, item2);
    const crew = this.calculateCrewSimilarity(item1, item2);
    const collection = this.calculateCollectionSimilarity(item1, item2);

    const weighted = this.weight({ origin, keywords, genre_ids, cast, crew, collection }, parsed);

    return weighted;
  }

  public calculate(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const data = this.calculateSimilarity(item1, item2, config);

    return data;
  }

  public async get(id: number, type: MovieDbTypeEnum) {
    const item = await tmdb.getFast(id, helper.isMovie(type) ? 1 : 0);

    const collection = (await backend.cachedItems()).items.filter(
      (i) => helper.sumId(i.id_db, i.type) !== helper.sumId(item.id_db, item.type)
    );

    const sorted = sortByKey(
      collection.map((i) => ({ data: i, score: similarity.calculate(item, i) })),
      'score'
    ).map(({ data }) => data);

    return sorted;
  }
}

export const similarity = new Similarity();
export default similarity;
