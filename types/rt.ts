import { MovieDbTypeEnum } from './items';

export interface ActorReponse {
  name: string;
  url: string;
  image: string;
}

export interface CriticResponse {
  name: string;
  url: string;
  image: string;
  publications: string[];
}

export interface FranchiseResponse {
  title: string;
  url: string;
  image: string;
}

export interface MovieResponse {
  name: string;
  year: number | null;
  url: string;
  image: string;
  meterClass: string;
  meterScore: number | null;
  castItems: CastProps[];
  subline: string;
}

export interface TVSeriesResponse {
  title: string;
  startYear: number | null;
  endYear: number | null;
  url: string;
  meterClass: string;
  meterScore: number;
  image: string;
}

export interface CastProps {
  name: string;
  url: string;
}

export interface SearchResponse {
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

export interface FindMovieBase {
  name: string;
  year?: number;
}

export interface FindTVShowBase {
  title: string;
}

export interface FindBase {
  name: string;
  year?: number;
  type: MovieDbTypeEnum;
}
