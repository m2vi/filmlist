import { SimpleObject } from '@Types/items';
import { basicFetch } from '@utils/helper/fetch';
import QueryString from 'qs';

export class Omdb {
  constructor(private baseUrl = 'https://www.omdbapi.com/', private apiKey = 'daf5c972') {}

  async getByTitle(title: string) {
    return await this.fetch({ t: title });
  }

  async getById(id: string) {
    return await this.fetch({ i: id });
  }

  private async fetch(obj: SimpleObject<any>) {
    return await basicFetch(`${this.baseUrl}?${QueryString.stringify({ apikey: this.apiKey, ...obj })}`);
  }
}

export const omdb = new Omdb();
export default omdb;
