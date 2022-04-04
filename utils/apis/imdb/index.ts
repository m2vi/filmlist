import Vimdb from 'vimdb';
import { parser } from './parser';

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
