import { Person, Video } from 'moviedb-promise/dist/request-types';
import { Movie, Series } from 'vimdb';
import { FrontendItemProps, ItemProps, MovieDbTypeEnum, SimpleObject, VoteProps } from './items';
import { MovieResponse, TVSeriesResponse } from './rt';
import { FilterQuery } from 'mongoose';
import { ProductionCompany } from 'moviedb-promise/dist/types';
import { UserProps } from './user';

export type ProviderEntryProps = Array<{
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}>;

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

export interface RatingsResponse {
  [provider: string]: VoteProps;
}

export interface GetTranslationFromBase {
  overview: string | null;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface SortProps {
  key?: string;
  order?: 1 | -1;
}

export interface FindOptions {
  filter: FilterQuery<ItemProps>;
  sort?: SortProps;
  slice?: [number, number];
  shuffle?: boolean;
  browse?: boolean;
}

export interface FindOneOptions {
  filter: FilterQuery<ItemProps>;
}

export interface GetTabProps {
  user: string | UserProps;
  tab: string;
  locale: string;
  start: number;
  end: number;
  includeCredits?: boolean;
  custom_config?: TabFilterOptions | null;
  purpose?: string;
  shuffle?: boolean;
  browse?: boolean;
}

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

export type TabsType = SimpleObject<TabFilterOptions>;

export interface GetRecommendations {
  user: string;
  id: number;
  type: MovieDbTypeEnum;
  locale: string;
}

export interface GetTabResponse {
  tmdb?: boolean;
  key: string | null;
  length: number;
  items: FrontendItemProps[];
  query: SimpleObject<any>;
}

export interface PersonCredits {
  id: number | undefined;
  name: string | undefined;
  profile_path: string | undefined;
  popularity: number | undefined;

  loading?: boolean;
}
export type PersonsCredits = Array<PersonCredits>;

export interface GetPersonResponse {
  info: Person;
  items: FrontendItemProps[];
}

export interface CollectionProps {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  popularity: number;
  items?: FrontendItemProps[];
}

export interface GetCollectionProps {
  data: {
    id: number | undefined;
    overview: string | undefined;
    name: string | undefined;
    poster_path: null | undefined;
    backdrop_path: string | undefined;
    rating: number;
    genre_ids: number[];
    local_items: number;
    tmdb_items: number;
    local_marathon_length: number;
  };
  items: FrontendItemProps[];
}

export interface GetOptions {
  fast?: boolean;
}

export interface GetBaseOptions extends GetOptions {}

export interface FilmlistProductionCompany extends ProductionCompany {
  backdrop_path?: string | null;
  items?: number;
}

export type FilmlistGenres = Array<FilmlistGenre>;

export interface FilmlistGenre {
  id: number;
  name: string;
  backdrop_path: string | null;
  items: number;
}

export interface ProviderProps {
  id: number;
  name: string;
  logo_path: string;
  items?: number;

  key?: string;
  url?: string;
}
