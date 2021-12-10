import { FrontendItemProps, ItemProps } from '@utils/types';

class Search {
  async fetchMoreData(data: ItemProps[], pattern: string, locale: string = 'en', start: number = 0): Promise<FrontendItemProps[]> {
    try {
      const res = await (
        await fetch(
          `/api/manage/search?pattern=${encodeURIComponent(pattern)}&locale=${encodeURIComponent(locale)}&start=${encodeURIComponent(
            start
          )}`,
          {
            method: 'POST',
            body: JSON.stringify({ items: data }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      ).json();

      return res;
    } catch (error) {
      return [];
    }
  }
}

export const search = new Search();
export default search;
