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
  _id: ObjectId;
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
  release_date: number;
  type: MovieDbTypeEnum;
  watched: boolean;
}

export interface FrontendItemProps {
  _id: ObjectId;
  genre_ids: number[];
  name: string;
  poster_path: string;
  release_data: number;
}

export interface GenreProps {
  id: number;
  name: string;
}

export interface InsertProps {
  id_db: number;
  type: MovieDbTypeEnum;
  favoured: boolean;
  watched: boolean;
}

export interface TabFilterOptions {
  filter?: Partial<ItemProps>;
  sort?: string;
  reverse?: boolean;
  type?: ItemTypeEnum;
  includeGenres?: number[];
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
