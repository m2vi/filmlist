import { NextApiRequest } from 'next';
import cherrio from 'cheerio';

import _ from 'underscore';
import { lowerCase } from 'lodash';

import { GetUrlFromBaseProps } from '@Types/justwatch';
import { cachedFetch } from '@utils/helper/fetch';
import { getUniqueListBy } from '@utils/helper';
import { isMovie } from '@utils/helper/tmdb';

import { ProviderProps } from '@Types/filmlist';
import cache from '../cache';

export class Api {
  checkReq(query: { [key: string]: string | string[] }) {
    return _.has(query, 'id') && _.has(query, 'type') && _.has(query, 'provider');
  }

  public async getUrl(req: NextApiRequest) {
    if (!this.checkReq(req.query as any)) return { error: 'Missing query params' };

    const { id, type, provider } = Object.freeze(req.query) as any;

    try {
      const params = { id: parseInt(id), type: isMovie(type) ? 1 : 0, provider: lowerCase(provider) };
      const all_providers = await cache.get<ProviderProps[]>('providers');

      let res = null;

      res = await this.getUrlFromBase({
        all_providers,
        params,
        url: `https://www.themoviedb.org/${isMovie(type) ? 'movie' : 'tv'}/${id}/watch?locale=AT`,
      });

      if (!res) throw new Error('Unkown error');

      return res;
    } catch (error: any) {
      return { error: 'The provider most likely does not exist', details: error?.message };
    }
  }

  private async getUrlFromBase({ all_providers, params, url }: GetUrlFromBaseProps) {
    if (!url) return null;

    const scraped = await this.scrap(url, all_providers);

    return _.find(scraped, { key: params.provider })?.url;
  }

  private async getPage(url: string) {
    try {
      const res = await cachedFetch(url, 'text');

      return res;
    } catch (error) {
      return null;
    }
  }

  public async scrap(url: string, providers: ProviderProps[]): Promise<ProviderProps[]> {
    const html = await this.getPage(url);
    if (!html) return [];
    const $ = cherrio.load(html);

    return getUniqueListBy(
      $('.ott_provider')
        .filter(function () {
          return ['Ads', 'Stream'].includes($(this).find('h3').text());
        })
        .find('.providers li')
        .map(function () {
          const url = $(this).find('a').attr('href');
          const imageUrl = $(this).find('a img').attr('src');

          return { url, imageUrl: `/${imageUrl?.split('/')[imageUrl?.split('/').length - 1]}` };
        })
        .get()
        .map(({ url, imageUrl }) => {
          const name = _.find(providers, { logo_path: imageUrl })?.name;

          if (!name) throw new Error(`The provider (${imageUrl}) does not exist`);

          return {
            key: lowerCase(name),
            name,
            url,
            logo_path: imageUrl,
          };
        }),
      'logo_path'
    );
  }
}

export const api = new Api();
export default api;
