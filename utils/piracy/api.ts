import { basicFetch } from '@utils/fetch';
import { ItemProps } from '@utils/types';
import tmdb from '@utils/themoviedb/api';
import querystring from 'qs';

export class Api {
  async getData(id: string, type: string) {
    try {
      const item = (await tmdb.get(parseInt(id), type as any, { state: 0 })) as any;
      const [streamkiste, filmpalast, movieking] = await Promise.all([
        this.streamkiste(item),
        this.filmpalast(item),
        this.moviekingCC(item),
      ]);

      return Object.entries({ streamkiste, filmpalast, movieking })
        .map(([key, value]: any) => value)
        .filter((v) => v);
    } catch {
      return [];
    }
  }

  async streamkiste(item: ItemProps) {
    try {
      const data = await basicFetch('https://streamkiste.tv/include/live.php', {
        method: 'POST',
        body: new URLSearchParams({
          keyword: item.external_ids.imdb_id!,
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

  async moviekingCC(item: ItemProps) {
    try {
      const qs = querystring.stringify({ term: item.name.de });
      const data = await basicFetch(`https://movieking.cc/home/autocompleteajax?${qs}`);

      const result = data.find(({ title }: any) => [item.name.de, item.original_name, item.name.en].includes(title));
      if (!result) return null;

      return {
        provider: 'Movieking.cc',
        url: result?.url,
      };
    } catch (error) {
      return null;
    }
  }
}

export const api = new Api();
export default api;
