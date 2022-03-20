import { ItemProps, MovieDbTypeEnum, SimilarityConfig } from '@utils/types';
import main from './main';
import tmdb from '../tmdb/api';
import helper from './helper';

class Similarity {
  public calculate(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const data = main.calculateSimilarity(item1, item2, config);

    return data;
  }

  public async get(id: number, type: MovieDbTypeEnum) {
    const item = await tmdb.getFast(id, helper.main.isMovie(type) ? 1 : 0);

    const collection = await helper.getCollection(item);

    const sorted = helper.sortByScore(collection.map((i) => ({ ...i, similarity_score: this.calculate(item, i) })));

    return sorted;
  }
}

export const similarity = new Similarity();
export default similarity;
