import { faker } from '@faker-js/faker';
import { isMovie } from '@helper/main';
import { FindBase, FindMovieBase, FindTVShowBase, MovieResponse, SearchResponse } from '@Types/rt';
import { lowerCase } from 'lodash';
import QueryString from 'qs';

class Rt {
  private dumbNumberFunction(year: number) {
    return [year - 1, year, year + 1];
  }

  async search(query: string): Promise<SearchResponse> {
    const response = await fetch(`https://www.rottentomatoes.com/napi/search?${QueryString.stringify({ query })}`, {
      headers: {
        'user-agent': faker.internet.userAgent(),
      },
    });
    const json = await response.json();

    return json;
  }

  async findMovie({ name, year }: FindMovieBase): Promise<MovieResponse | null> {
    const results = (await this.search(name)).movies;

    if (!results) return null;

    const result = results?.find((item) => {
      return (
        (lowerCase(item.name).includes(lowerCase(name)) || lowerCase(name).includes(lowerCase(item.name))) &&
        (year ? (item.year ? this.dumbNumberFunction(year).includes(item.year) : true) : true)
      );
    });

    return result ? result : null;
  }

  async findTVShow({ title }: FindTVShowBase) {
    const results = (await this.search(title)).tvSeries;

    if (!results) return null;

    const result = results?.find((item) => lowerCase(title) === lowerCase(item.title));

    return result ? result : null;
  }

  async find({ name, type, year }: FindBase) {
    try {
      if (isMovie(type)) {
        return await this.findMovie({ name, year });
      } else {
        return await this.findTVShow({ title: name });
      }
    } catch (error) {
      return null;
    }
  }
}

export const rt = new Rt();
export default rt;
