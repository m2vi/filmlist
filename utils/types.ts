import { FilterQuery, Types } from 'mongoose';
import { MovieExternalIdsResponse, Video, VideosResponse } from 'moviedb-promise/dist/request-types';

export enum ItemTypeEnum {
  'tv' = 0,
  'movie' = 1,
  'both' = 2,
}

export enum MovieDbTypeEnum {
  'tv' = 0,
  'movie' = 1,
}

export interface GetBrowseGenreProps {
  locale: string;
  seed: string;
  index: number;
}

export interface GetTabProps {
  tab: string;
  locale: string;
  start: number;
  end: number;
  includeCredits?: boolean;
  dontFrontend?: boolean;
  release_year?: string;
  custom_config?: TabFilterOptions | null;
  purpose?: string;
}

export interface GetTMDBTabProps {
  tab: string;
  type: any;
  locale: string;
  page: number;
  purpose?: string;
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
  department?: string;
  gender?: number | null;
  id?: number;
  known_for_department?: string;
  job?: string;
  original_name?: string;
  profile_path?: string | null;
}

export interface CreditProps {
  id: number;
  cast: CastProps[];
  crew: CrewProps[];
}

export interface ItemProps {
  _id: Types.ObjectId | string | null;
  genre_ids: number[];
  id_db: number;
  external_ids: MovieExternalIdsResponse;
  overview: {
    [locale: string]: string;
  };
  name: {
    [locale: string]: string;
  };
  original_language: string;
  original_name: string;
  poster_path: {
    [locale: string]: string;
  };
  backdrop_path: {
    [locale: string]: string;
  };
  release_date: number;
  runtime: number;
  type: MovieDbTypeEnum;
  credits: CreditProps | null;
  watchProviders: ProviderEntryProps | null;
  state: number | number[];
  collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  trailers: Video[] | null;
  ratings: RatingsProps | null;
  popularity: number | null;
  v: number;
}

export interface VoteProps {
  vote_average: number | null;
  vote_count: number | null;
}

export interface ProviderEntryProps {
  url: string | undefined | null;
  providers: ProviderProps[] | null;
}

export interface FrontendItemProps {
  _id: string | null;
  id_db: number;
  genre_ids: number[];
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: number;
  type: MovieDbOptions;
  state: number;
  ratings: RatingsProps | null;
  watchProviders: ProviderEntryProps | null;
}

export interface RatingsProps {
  [provider: string]: VoteProps | null;
}

export interface NotificationItemProps {
  url: string;
  name: string;
  backdrop_path: string | null;
  release_date: string;
}

export interface BrowseSectionProps {
  length: number;
  items: FrontendItemProps[];
  name: string | null;
  route: string | null;
}

export interface GenreProps {
  id: number;
  name: string;
}

export type State = -1 | 1 | 2 | 3;
// -1 - not watched
// 1 - watched
// 2 - favoured
// 3 - highlighted

export interface BaseProps {
  id: number;
  type: number;
}

export interface InsertProps {
  id_db: number;
  type: MovieDbTypeEnum;
  state: number;
}

export interface ManageInsertProps {
  id_db: string;
  type: string;
  state: string;
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

export interface Tabs {
  [key: string]: TabFilterOptions;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
}

export interface MongooseBase {
  _id: Types.ObjectId;
  __v: number;
}

export interface JwtBase {
  iat: number;
  exp: number;
}

export interface JwtPayload {
  jti: string;
  iat: number;
}

export interface MovieDbOptions {
  favoured: boolean;
  watched: boolean;
}

export interface ProviderProps {
  id?: number;
  name?: string;
  logo?: string;
  type?: string;
}

export interface LogProps {
  progress: number;
  remaining_time: string;
  elapsed_time: string;
  average_time_per_job: number;
  errors: number;
  updated: number;
  modified: number;
  info: {
    id: string | undefined;
    tmdb_id: number;
  };
}

export interface FindOptions {
  includeCredits?: boolean;
  sort?: SortProps;
  slice?: [number, number];
}

export interface SortProps {
  key?: string;
  order?: 1 | -1;
}
