import { FrontendItemProps } from '@utils/types';

class Search {
  async fetchMoreData(pattern: string, locale: string = 'en'): Promise<FrontendItemProps[]> {
    try {
      const res = await (
        await fetch(`/api/manage/search?pattern=${encodeURIComponent(pattern)}&locale=${encodeURIComponent(locale)}`)
      ).json();

      return res;
    } catch (error) {
      return [];
    }
  }
}

export const search = new Search();
export default search;
