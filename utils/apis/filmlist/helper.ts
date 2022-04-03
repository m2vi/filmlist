import { GetTranslationFromBase, TabFilterOptions } from '@Types/filmlist';
import { ExternalIds, FrontendItemProps, ItemProps, SimpleObject } from '@Types/items';
import { MovieResponse, TVSeriesResponse } from '@Types/rt';
import {
  MovieExternalIdsResponse,
  MovieImagesResponse,
  MovieTranslationsResponse,
  TvExternalIdsResponse,
  TvImagesResponse,
  TvTranslationsResponse,
} from 'moviedb-promise/dist/request-types';
import _, { object } from 'underscore';
import { FilterQuery } from 'mongoose';
import { CardProps } from '@components/Card';
import { sortByKey } from '@m2vi/iva';
import { moment } from '../moment';

export const getTranslationFromBase = (
  base: any,
  translations: MovieTranslationsResponse | TvTranslationsResponse,
  images: MovieImagesResponse | TvImagesResponse
): GetTranslationFromBase => {
  let translation = _.find(translations?.translations ? translations?.translations : [], { iso_639_1: 'de' })?.data;
  if (!translation) translation = _.find(translations?.translations ? translations?.translations : [], { iso_639_1: 'en' })?.data;
  const poster = _.find(images?.posters ? images?.posters : [], { iso_639_1: 'de' })?.file_path;
  const backdrop = _.find(images?.backdrops ? images?.backdrops : [], { iso_639_1: 'de' as any })?.file_path;

  const result = {
    overview: translation?.overview ? translation?.overview : base?.overview,
    name: translation?.title ? translation?.title : base?.title ? base?.title : base?.name,
    poster_path: poster ? poster : base?.poster_path ? base?.poster_path : null,
    backdrop_path: backdrop ? backdrop : base?.backdrop_path ? base?.backdrop_path : null,
  };

  return result;
};

export const isAnime = (item: any) => {
  const genre_ids: number[] = item?.genres ? item?.genres?.map((item: any) => item?.id) : item.genre_ids;
  const original_language: string = item?.original_language;

  if (!genre_ids || !original_language) {
    return false;
  }

  if (genre_ids.includes(7424) || (genre_ids.includes(16) && original_language === 'ja')) {
    return true;
  }

  return false;
};

export const parseExternalIds = (
  external_ids: MovieExternalIdsResponse | TvExternalIdsResponse,
  rt_item: MovieResponse | TVSeriesResponse | null
): ExternalIds => {
  return {
    ...external_ids,
    rt_id: rt_item?.url ? rt_item?.url : null,
  };
};

export const getWatchProvidersFromBase = (response: any) => {
  const arr = (response?.results?.AT?.flatrate ? response?.results?.AT?.flatrate : []).concat(
    response?.results?.AT?.ads ? response?.results?.AT?.ads : []
  );

  return arr?.length > 0 ? arr : null;
};

export function getYearNumbers(year: number | string): FilterQuery<ItemProps> {
  // maybe dumb asf
  const start = new Date(`${year}-01-01 00:00:00`).getTime();
  const end = new Date(`${year}-12-31 24:00:00`).getTime();

  return {
    release_date: {
      $lte: end,
      $gte: start,
    },
  };
}

export function getReleaseConfig(config: TabFilterOptions | null): FilterQuery<ItemProps> {
  if (config?.release_year) {
    return getYearNumbers(config?.release_year);
  } else if (config?.hide_unreleased) {
    return {
      release_date: {
        $lte: new Date().getTime(),
      },
    };
  } else if (config?.only_unreleased) {
    return {
      release_date: {
        $gte: new Date().getTime(),
      },
    };
  }

  return {};
}

export const placeholderCards = (n: number): Partial<CardProps>[] => {
  return Array.from(
    { length: n },
    (): Partial<CardProps> => ({
      isLoading: true,
    })
  );
};

export const getAverageRatingFromItems = (items: FrontendItemProps[]) => {
  const filtered = items.filter(({ ratings }) => ratings!.tmdb.vote_average);
  const sum = filtered.reduce((a, { ratings }) => a + ratings!.tmdb.vote_average!, 0);
  const avg = sum / filtered.length || 0;

  return parseFloat(avg.toPrecision(12));
};

export const reduceNumArray = (arr: number[]) => {
  return arr.reduce((prev, curr) => prev + curr, 0);
};

export const removeDuplicates = <T>(arr: T[]): T[] => {
  return arr.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
};

export const collectionGenreIds = (ids: number[][]) => {
  const arr = ids.reduce((prev, curr) => [...prev, ...curr], []);
  const obj: SimpleObject<{ id: number; count: number }> = {};

  removeDuplicates(arr).forEach((id) => {
    obj[id] = { id, count: arr.filter((i) => id === id).length };
  });

  return sortByKey(
    Object.entries(obj).map(([id, value]) => value),
    'count'
  ).map(({ id }) => id);
};

export const durationFormat = (minutes: number, locale: string) => {
  moment.locale(locale);
  return moment.duration(minutes, 'minutes').format('h[h] mm[m]');
};
