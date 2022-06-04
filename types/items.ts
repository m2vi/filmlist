import { FilterQuery } from 'mongoose';
import { Cast, Crew, SimplePerson, Video } from 'moviedb-promise/dist/request-types';
import { ProductionCompany } from 'moviedb-promise/dist/types';
import { Movie, Series } from 'vimdb';
import { SimpleObject } from './common';
import { FDetails, RawDetails } from './info';
import { BaseProviderProps } from './justwatch';
import { MovieResponse, TVSeriesResponse } from './rt';
import { UserProps } from './user';

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
  overview: string | null;
  external_ids: ExternalIds;
  original_language: string;
  popularity: number | null;
  rated: string | null;

  details: FDetails | null;
}

export interface ExternalIds {
  rt_id?: string | null; //? not normally included. only after being added by the parseExternalIds function

  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;

  id?: number | null; //! does not exist on append_to_request
}

export enum MovieDbTypeEnum {
  'tv' = 0,
  'movie' = 1,
}

export interface VoteProps {
  vote_average: number | null;
  vote_count: number | null;
  vote_class?: string | null; //! rt
}

export interface RatingsResponse {
  [provider: string]: VoteProps;
}

export type CreditProps = {
  crew: Crew[];
  cast: Cast[];
};

export interface ItemProps {
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
  credits?: CreditProps;
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

  index?: number; //? old

  details?: RawDetails;
}

export interface BaseResponse {
  tmdb_item: any;
  rt_item: MovieResponse | TVSeriesResponse | null;
  imdb_item: Movie | Series | null;
  imdb_keywords: string[];
  translation_de: GetTranslationFromBase;
  trailers: Video[] | null;
  certificate: string | null;
  watchProviders: any;
  ratings: RatingsResponse;
  isMovie: boolean;
}

export interface GetTranslationFromBase {
  overview: string | null;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface GetTabProps {
  user: string | UserProps;
  tab: string;
  locale: string;
  start: number;
  end: number;
  includeCredits?: boolean;
  custom_config?: TabFilterOptions | null;
  purpose: PurposeType;
  shuffle?: boolean;
}

export type PurposeType = 'items' | 'items_f' | 'items_l';

export interface TabFilterOptions {
  filter?: FilterQuery<ItemProps>;
  sort_key?: string | boolean;
  reverse?: boolean;
  includeGenres?: number[];
  only_unreleased?: boolean;
  hide_unreleased?: boolean;
  minVotes?: number;
  includeCredits?: boolean;
  language?: string;
  release_year?: string;
}

export interface GetTabResponse {
  tmdb?: boolean;
  key: string | null;
  length: number;
  items: FrontendItemProps[];
  query: SimpleObject<any>;
}

export interface FilmlistProductionCompany extends ProductionCompany {
  backdrop_path?: string | null;
  items?: number;
}

export interface GetOptions {
  fast?: boolean;
}

export interface GetBaseOptions extends GetOptions {}

export interface SortProps {
  key?: string;
  order?: 1 | -1;
}

export interface FindOptions {
  purpose: PurposeType;
  filter: FilterQuery<ItemProps>;
  sort?: SortProps;
  slice?: [number, number];
  shuffle?: boolean;
}

export interface FindOneOptions {
  filter: FilterQuery<ItemProps>;
}

export interface PersonCredits {
  id: number | undefined;
  name: string | undefined;
  profile_path: string | undefined;
  popularity: number | undefined;

  loading?: boolean;
}

export type PersonsCredits = Array<PersonCredits>;

export interface CardProps extends FrontendItemProps {
  isLoading?: boolean;
}

export type FilmlistGenres = Array<FilmlistGenre>;

export interface FilmlistGenre {
  id: number;
  name: string;
  backdrop_path: string | null;
  items: number;
}

export type TabsType = SimpleObject<TabFilterOptions>;
