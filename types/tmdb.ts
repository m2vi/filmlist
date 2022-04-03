import { MovieDbTypeEnum } from './items';

export interface TmdbGetTab {
  user: string;
  tab: string;
  locale: string;
  page: number;
  type: MovieDbTypeEnum;
}

export interface TmdbGetTrending {
  user: string;
  media_type: 'all' | 'movie' | 'tv'; //! removed 'person'
  time_window: 'day' | 'week';
  language: string;
}
