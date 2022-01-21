import { NextApiRequest } from 'next';
import tmdb from '@utils/tmdb/api';
import backend from '@utils/backend/api';
import cherrio from 'cheerio';
import { baseUrl } from '@utils/fetch';
import { getUniqueListBy } from '@utils/utils';
import { sortByKey } from '@utils/array';
import _ from 'underscore';
import { lowerCase } from 'lodash';

export class Api {
  constructor(private fallbackUrl = '/error') {}

  public async getUrl(req: NextApiRequest) {
    const base = baseUrl(req);
    try {
      if (!_.has(req.query, 'id') || !_.has(req.query, 'type') || !_.has(req.query, 'provider')) return `${base}${this.fallbackUrl}`;
      const { id, type, provider } = Object.freeze(req.query) as any;

      const params = { id: parseInt(id), type: tmdb.isMovie(type) ? 1 : 0, provider: lowerCase(provider) };

      const all_providers = await this.getProvider();
      const curr_providers = await tmdb.watchProviders(null, Boolean(params.type), { id: params.id, language: 'en' });

      const scraped = await this.scrap(curr_providers?.url!, all_providers);

      const s = _.find(scraped, { key: params.provider })?.url;

      return `${s ? s : `${base}${this.fallbackUrl}`}`;
    } catch (error) {
      console.log(error);
      return `${base}${this.fallbackUrl}`;
    }
  }

  private async getPage(url: string) {
    try {
      const res = await fetch(url);
      const html = await res.text();

      return html;
    } catch (error) {
      return null;
    }
  }

  private async getProvider(): Promise<Array<{ name: string; logo: string }>> {
    const data = await backend.schema.find().select({ 'watchProviders.providers.logo': 1, 'watchProviders.providers.name': 1 }).lean();

    const arr = data.reduce((prev, curr, index) => {
      return prev.concat((curr?.watchProviders?.providers ? curr?.watchProviders?.providers : []) as any);
    }, []);

    return sortByKey(getUniqueListBy(arr, 'logo'), 'name');
  }

  public async scrap(url: string, providers: Array<{ name: string; logo: string }>): Promise<Array<string> | any> {
    const html = await this.getPage(url);
    if (!html) return [];
    const $ = cherrio.load(html);

    return getUniqueListBy(
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
