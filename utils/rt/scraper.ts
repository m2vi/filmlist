import faker from '@faker-js/faker';
import { lowerCase, result } from 'lodash';
import QueryString from 'qs';

interface ActorReponse {
  name: string;
  url: string;
  image: string;
}

interface CriticResponse {
  name: string;
  url: string;
  image: string;
  publications: string[];
}

interface FranchiseResponse {
  title: string;
  url: string;
  image: string;
}

interface MovieResponse {
  name: string;
  year: number | null;
  url: string;
  image: string;
  meterClass: string;
  meterScore: number | null;
  castItems: CastProps[];
  subline: string;
}

interface TVSeriesResponse {
  title: string;
  startYear: number | null;
  endYear: number | null;
  url: string;
  meterClass: string;
  meterScore: number;
  image: string;
}

interface CastProps {
  name: string;
  url: string;
}

interface SearchResponse {
  actors: ActorReponse[];
  critics: CriticResponse[];
  franchises: FranchiseResponse[];
  movies: MovieResponse[];
  tvSeries: TVSeriesResponse[];
  actorCount: number;
  criticCount: number;
  franchiseCount: number;
  movieCount: number;
  tvCount: number;
}

interface FindMovieBase {
  name: string;
  year: number;
}

interface FindTVShowBase {
  title: string;
}

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

    const result = results.find((item) => {
      return (
        (lowerCase(item.name).includes(lowerCase(name)) || lowerCase(name).includes(lowerCase(item.name))) &&
        (item.year ? this.dumbNumberFunction(year).includes(item.year) : true)
      );
    });

    return result ? result : null;
  }

  async findTVShow({ title }: FindTVShowBase) {
    const results = (await this.search(title)).tvSeries;

    const result = results.find((item) => lowerCase(title) === lowerCase(item.title));

    return result ? result : null;
  }
}

export const rt = new Rt();
export default rt;
