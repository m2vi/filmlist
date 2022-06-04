import Vimdb from 'vimdb';
import * as cheerio from 'cheerio';

class Parser {
  private async html(url: string) {
    return await (await fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.8' } })).text();
  }

  async keywords(id: string) {
    const html = await this.html(`https://www.imdb.com/title/${id}/keywords`);
    const $ = cheerio.load(html);

    return $('td.soda')
      .map((i, el) => $(el).find('div.sodatext').text().trim())
      .get();
  }
}

export const parser = new Parser();

export enum SearchType {
  Title = 'tt',
  Name = 'nm',
}

export class Imdb {
  vimdb: Vimdb;
  constructor(language: string | undefined = 'en-UK') {
    this.vimdb = new Vimdb(language);
  }

  async search(query: string, type?: SearchType | undefined) {
    return await this.vimdb.search(query, type);
  }

  async get(id: string) {
    try {
      return await this.vimdb.getShow(id);
    } catch (error) {
      return null;
    }
  }

  async keywords(id: string) {
    try {
      return await parser.keywords(id);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAllData(id: string) {
    return await this.vimdb.getAllShowData(id);
  }
}

export const imdb = new Imdb();
export default imdb;
