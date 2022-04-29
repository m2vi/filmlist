import { Types } from 'mongoose';
import { SimplePerson, Video, Crew, Cast } from 'moviedb-promise/dist/request-types';
import { ProductionCompany } from 'moviedb-promise/dist/types';
import { RawDetails } from './downloads';
import { RatingsResponse } from './filmlist';
import { BaseProviderProps } from './justwatch';

export enum MovieDbTypeEnum {
  'tv' = 0,
  'movie' = 1,
}

export interface CastProps {
  character: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  original_name: string;
  profile_path: string | null;
}

export interface CrewProps {
  department: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  job: string;
  original_name: string;
  profile_path: string | null;
}

export type CreditProps = {
  crew: Crew[];
  cast: Cast[];
};

export interface ExternalIds {
  rt_id?: string | null; //? not normally included. only after being added by the parseExternalIds function

  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;

  id?: number | null; //! does not exist on append_to_request ig
}

export interface SimpleObject<T> {
  [key: string]: T;
}

export interface ItemProps {
  _id?: Types.ObjectId | string | null;
  id_db: number;
  backdrop_path: SimpleObject<string | null>;
  created_by: Array<SimplePerson> | null;
  runtime: number;
  release_date: number;
  genre_ids: number[];
  name: SimpleObject<string | null>;
  number_of_episodes: number | null;
  number_of_seasons: number | null;
  original_language: string;
  original_name: string;
  overview: SimpleObject<string | null>;
  summary: string | null;
  popularity: number | null;
  poster_path: SimpleObject<string | null>;
  budget: number | null;
  revenue: number | null;
  tagline: string | null;
  status: string | null;
  rated: string | null | undefined;
  type: MovieDbTypeEnum;
  ratings: RatingsResponse | null;
  production_companies: Array<ProductionCompany>;
  external_ids: ExternalIds;
  credits?: CreditProps; //! not in cache
  keywords: Array<{ id: number; name: string }>;
  imdb_keywords: Array<string>;
  watchProviders: BaseProviderProps[] | null;
  collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  trailers: Video[] | null;

  updated_at: number | null;

  similarity_score?: number; //? algorithm property

  user_index?: number | null; //? user property e.g. 0
  user_rating?: number | null; //? user property e.g. 7.0
  user_state?: number | null; //? user property e.g. 1
  user_date_added?: number | null; //? user property e.g. unix timestamp
  file_date_added?: number | null; //? user property e.g. unix timestamp
  file_details?: RawDetails | null; //? user property

  index?: number; //? old
}

export interface VoteProps {
  vote_average: number | null;
  vote_count: number | null;
  vote_class?: string | null; //! rt
}

export interface FrontendItemProps {
  id_db: number;
  genre_ids: number[];
  name: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: number;
  runtime: number | null;
  type: MovieDbTypeEnum;
  ratings: RatingsResponse | null;

  similarity_score?: number; //? algorithm property

  user_state?: number | null; //? user property e.g. 1
  user_rating?: number | null; //? user property e.g. 7.0
  user_date_added?: number | null; //? user property e.g. unix timestamp
}
