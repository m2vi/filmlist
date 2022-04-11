import main from './main';
import helper from './helper';
import { isMovie } from '@utils/helper/tmdb';
import filmlist from '@utils/apis/filmlist';
import { FrontendItemProps, ItemProps, MovieDbTypeEnum } from '@Types/items';
import { SimilarityConfig } from '@Types/similarity';
import user from '@utils/user';
import convert from '@utils/convert/main';
import sift from 'sift';
import { GetTabResponse } from '@Types/filmlist';
import { UserProps } from '@Types/user';

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

  public async getForYou(user_id: string | UserProps, locale: string, start: number, end: number): Promise<GetTabResponse> {
    const client = typeof user_id === 'string' ? await user.find(user_id) : user_id;
    const items = user.appendUserAttributes(await helper.getCollection({}), client);

    const list = items.filter(sift({ $or: [{ user_state: { $lt: 0 } }, { user_state: null }] }));
    const comp = items.filter(sift({ $or: [{ user_rating: { $gte: 7 } }, { user_state: 2 }] }));

    const result = list.map((item) => {
      const score = comp.reduce((prev, curr) => prev + this.calculate(item, curr), 0) / comp.length;

      return {
        ...item,
        similarity_score: parseFloat(score.toPrecision(12)),
      };
    });

    const final = convert.prepareForFrontend(helper.sortByScore(result).reverse(), locale).slice(start, end);

    return {
      items: final,
      key: 'for_you',
      length: final.length,
      query: {
        user: user_id,
        tab: 'for_you',
        locale,
        start,
        end,
        purpose: 'items',
      },
    };
  }
}

export const similarity = new Similarity();
export default similarity;
