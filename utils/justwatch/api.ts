import { NextApiRequest } from 'next';
import tmdb from '@utils/tmdb/api';
import cherrio from 'cheerio';
import { baseUrl } from '@utils/fetch';
import { getUniqueListBy } from '@utils/utils';
import _ from 'underscore';
import { lowerCase } from 'lodash';
import { config } from '@utils/backend/config';
import { GetUrlFromBaseProps, ProviderProps } from '@utils/types';
import QueryString from 'qs';
import { cachedFetch } from '@utils/backend/fetch';

export class Api {
  constructor(private fallbackUrl = '/error') {}

  public async getUrl(req: NextApiRequest) {
    const base = baseUrl(req);
    if (!_.has(req.query, 'id') || !_.has(req.query, 'type') || !_.has(req.query, 'provider'))
      return `${base}${this.fallbackUrl}?${QueryString.stringify({ error: 'Missing query params' })}`;
    const { id, type, provider } = Object.freeze(req.query) as any;

    try {
      const params = { id: parseInt(id), type: tmdb.isMovie(type) ? 1 : 0, provider: lowerCase(provider) };
      const all_providers = config.getProvidersSync();

      let res = null;

      res = await this.getUrlFromBase({
        all_providers,
        params,
        url: `https://www.themoviedb.org/${type ? 'movie' : 'tv'}/${id}/watch?locale=AT`,
      });

      if (!res) throw new Error('Unkown error');

      return res;
    } catch (error: any) {
      const qs = QueryString.stringify({ error: 'The provider most likely does not exist', details: error?.message });

      return `${base}/${type}/${id}?${qs}`;
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
      // file deepcode ignore UseArrowFunction: <cheerio needs normal function>
      $('.ott_provider')
        .filter(function () {
          return $(this).find('h3').text() === 'Stream';
        })
        .find('.providers li')
        .map(function () {
          const url = $(this).find('a').attr('href');
          const imageUrl = $(this).find('a img').attr('src');

          return { url, imageUrl: `/${imageUrl?.split('/')[imageUrl?.split('/').length - 1]}` };
        })
        .get()
        .map(({ url, imageUrl }) => {
          const name = _.find(providers, { logo: imageUrl })?.name;

          if (!name) throw new Error(`the provider (${imageUrl}) does not exist`);

          return {
            key: lowerCase(name),
            name,
            url,
            logo: imageUrl,
          };
        }),
      'logo'
    );
  }
}

export const api = new Api();
export default api;
