import { basicFetch } from '@utils/fetch';
import { ItemProps } from '@utils/types';
import tmdb from '@utils/themoviedb/api';

export class Api {
  async getData(id: string, type: string) {
    const item = (await tmdb.get(parseInt(id), type as any, { state: 0 })) as any;
    const [streamkiste, filmpalast] = await Promise.all([this.streamkiste(item), this.filmpalast(item)]);

    return {
      streamkiste,
      filmpalast,
    };
  }

  async streamkiste(item: ItemProps) {
    try {
      const data = await basicFetch('https://streamkiste.tv/include/live.php', {
        method: 'POST',
        body: new URLSearchParams({
          keyword: item.name.de,
          nonce: '273e0f8ea3',
        }),
      });

      const result = Object.entries(data).map(([id, value]: any) => {
        if (![item.name.de.toLowerCase(), item.original_name.toLowerCase()].includes(value.title.toLowerCase())) return null;
        return {
          provider: 'StreamKisteTV',
          url: `https://streamkiste.tv${value.url}`,
        };
      })[0];

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }

  async filmpalast(item: ItemProps) {
    try {
      const data = await basicFetch('https://filmpalast.to/autocomplete.php', {
        method: 'POST',
        body: new URLSearchParams({
          term: item.name.de,
        }),
      });

      const result = data.map((value: any) => {
        if (![item.name.de.toLowerCase(), item.original_name.toLowerCase()].includes(value.toLowerCase())) return null;
        return {
          provider: 'Filmpalast.to',
          url: `https://filmpalast.to/search/title/${encodeURIComponent(item.name.de)}`,
        };
      })[0];

      if (!result) return null;

      return result;
    } catch (error) {
      return null;
    }
  }
}

export const api = new Api();
export default api;
