import genreList from '@data/genres.json';
import { removeDuplicates, sortByKey } from '@utils/array';
import _ from 'underscore';

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

  getNames(genre_ids: number[]): string[] {
    return genre_ids.map((id) => this.getName(id));
  }
}

export default new Genres();
