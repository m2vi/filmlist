import genreList from '@data/genres.json';
import config from '@data/config.json';
import { removeDuplicates } from '../filmlist/helper';
import { sortByKey } from '@m2vi/iva';

class Genres {
  constructor() {}

  get array(): {
    id: number;
    name: string;
  }[] {
    return removeDuplicates(sortByKey(genreList.data, 'name'));
  }

  get ids() {
    return this.array.map(({ id }) => id);
  }

  get names() {
    return this.array.map(({ name }) => name);
  }

  getName(genre_id: number): string {
    const result = this.array.find(({ id }) => genre_id === id)?.name;
    return result ? result : '';
  }

  getID(genre_name: string): number {
    const result = this.array.find(({ name }) => genre_name === name)?.id;
    return result ? result : 0;
  }

  getNames(genre_ids: number[]): string[] {
    return genre_ids.map((id) => this.getName(id));
  }
}

export default new Genres();
