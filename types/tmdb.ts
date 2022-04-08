import { Company } from 'moviedb-promise/dist/request-types';
import { MovieDbTypeEnum } from './items';
import { UserProps } from './user';

export interface TmdbGetTab {
  user: string | UserProps;
  tab: string;
  locale: string;
  page: number;
  type: MovieDbTypeEnum;
}

export interface TmdbGetUpcoming {
  user: string | UserProps;
  locale: string;
  page: number;
  type: MovieDbTypeEnum;
}

export interface TmdbGetTrending {
  user: string | UserProps;
  media_type: 'all' | 'movie' | 'tv'; //! removed 'person'
  time_window: 'day' | 'week';
  language: string;
}

export interface GetCompanyResponse extends Company {}
