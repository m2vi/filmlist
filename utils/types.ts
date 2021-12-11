import { ObjectId } from 'mongoose';

export enum ItemTypeEnum {
  'tv' = 0,
  'movie' = 1,
  'both' = 2,
}

export enum MovieDbTypeEnum {
  'tv' = 0,
  'movie' = 1,
}

export interface ItemProps {
  _id: ObjectId | null;
  hall_of_fame: boolean;
  favoured: boolean;
  genre_ids: number[];
  id_db: number;
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
  type: MovieDbTypeEnum;
  watched: boolean;
}

export interface FrontendItemProps {
  _id: string | null;
  id_db: number;
  genre_ids: number[];
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: number;
}

export interface NotificationItemProps {
  _id: string | null;
  name: string;
  backdrop_path: string | null;
  release_date: string;
}

export interface BrowseSectionProps {
  length: number;
  items: FrontendItemProps[];
  name: string;
  route: string;
}

export interface GenreProps {
  id: number;
  name: string;
}

export interface InsertProps {
  id_db: number;
  type: MovieDbTypeEnum;
  favoured: string;
  watched: string;
}

export interface TabFilterOptions {
  filter?: Partial<ItemProps>;
  sort_key?: string | boolean;
  reverse?: boolean;
  includeGenres?: number[];
  only_unreleased?: boolean;
  hide_unreleased?: boolean;
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
  _id: ObjectId;
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
