import main from './main';
import helper from './helper';
import { isMovie } from '@utils/helper/tmdb';
import filmlist from '@utils/apis/filmlist';
import { ItemProps, MovieDbTypeEnum } from '@Types/items';
import { SimilarityConfig } from '@Types/similarity';
import { UserProps } from '@Types/user';

class Similarity {
  public calculate(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const data = main.calculateSimilarity(item1, item2, config);

    return data;
  }

  public async get(id: number, type: MovieDbTypeEnum, user_id: string) {
    const item = await filmlist.getFast(id, isMovie(type) ? 1 : 0, user_id);

    const collection = await helper.getCollection(item);

    const sorted = helper.sortByScore(collection.map((i) => ({ ...i, similarity_score: this.calculate(item, i) })));

    return sorted;
  }
}

export const similarity = new Similarity();
export default similarity;
