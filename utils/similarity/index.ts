import main from './main';
import helper from './helper';
import { isMovie } from '@utils/helper/tmdb';
import filmlist from '@utils/apis/filmlist';
import { FrontendItemProps, ItemProps, MovieDbTypeEnum } from '@Types/items';
import { SimilarityConfig } from '@Types/similarity';
import { UserProps } from '@Types/user';
import user from '@utils/user';
import convert from '@utils/convert/main';

class Similarity {
  public calculate(item1: ItemProps, item2: ItemProps, config: SimilarityConfig = {}): number {
    const data = main.calculateSimilarity(item1, item2, config);

    return data;
  }

  public async get(id: number, type: MovieDbTypeEnum, user_id: string) {
    const item = await filmlist.getFast(id, isMovie(type) ? 1 : 0, user_id);

    const collection = await helper.getCollection(item);

    const { data: sorted, time } = helper.track(() =>
      helper.sortByScore(collection.map((i) => ({ ...i, similarity_score: this.calculate(item, i) }))).reverse()
    );

    return sorted;
  }

  public async getF(id: number, type: MovieDbTypeEnum, locale: string, user_id: string): Promise<FrontendItemProps[]> {
    const client = await user.find(user_id);
    const items = await this.get(id, type, user_id);

    return convert.prepareForFrontend(user.appendUserAttributes(items, client), locale).slice(0, 20);
  }
}

export const similarity = new Similarity();
export default similarity;
