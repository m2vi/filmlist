import { CardProps, ExternalIds, GetTranslationFromBase, ItemProps, MovieDbTypeEnum, TabFilterOptions } from '@Types/items';
import { MovieResponse, TVSeriesResponse } from '@Types/rt';
import {
  MovieExternalIdsResponse,
  MovieImagesResponse,
  MovieReleaseDatesResponse,
  MovieTranslationsResponse,
  ReleaseDate,
  ShowContentRatingResponse,
  TvExternalIdsResponse,
  TvImagesResponse,
  TvTranslationsResponse,
  VideosResponse,
} from 'moviedb-promise/dist/request-types';
import find from 'lodash/find';
import { sortByKey } from '@m2vi/iva';
import { FilterQuery } from 'mongoose';

export const isMovie = (type: any) => {
  return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type?.toString() === '1';
};

export const isTV = (type: any) => {
  return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.tv || type?.toString() === '0';
};

export const isValidType = (type: any) => {
  const str = type?.toString();

  return ['movie', '1', 'tv', '0'].includes(str);
};

export const isValidId = (id: any) => {
  return id?.toString() === parseInt(id?.toString())?.toString();
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

export function getUniqueListBy<T>(arr: T[], key: keyof T) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export function checkUndefined<T, K>(value: T, defaultValue: K): T | K {
  if (typeof value === 'undefined') return defaultValue;

  return value;
}

export function sumId({ id_db, type }: Partial<ItemProps>) {
  return `${id_db}:${isMovie(type) ? 1 : 0}`;
}

export const getTranslationFromBase = (
  base: any,
  translations: MovieTranslationsResponse | TvTranslationsResponse,
  images: MovieImagesResponse | TvImagesResponse
): GetTranslationFromBase => {
  let translation = find(translations?.translations ? translations?.translations : [], { iso_639_1: 'de' })?.data;
  if (!translation) translation = find(translations?.translations ? translations?.translations : [], { iso_639_1: 'en' })?.data;
  const poster = find(images?.posters ? images?.posters : [], { iso_639_1: 'de' })?.file_path;
  const backdrop = find(images?.backdrops ? images?.backdrops : [], { iso_639_1: 'de' as any })?.file_path;

  //? check
  const result = {
    overview: translation?.overview ? translation?.overview : base?.overview,
    name:
      base?.original_language === 'de'
        ? base?.original_title
          ? base?.original_title
          : base?.original_name
        : translation?.title
        ? translation?.title
        : base?.title
        ? base?.title
        : base?.name,
    poster_path: poster ? poster : base?.poster_path ? base?.poster_path : null,
    backdrop_path: backdrop ? backdrop : base?.backdrop_path ? base?.backdrop_path : null,
  };

  return result;
};

export const getTrailers = (videos: VideosResponse) => {
  if (!videos.results) return null;

  return videos.results.filter(({ site, type }) => site === 'YouTube' && type === 'Trailer');
};

export const getTvCertificate = (data: ShowContentRatingResponse) => {
  const DE = find(data?.results!, { iso_3166_1: 'DE' });
  if (!DE) return null;

  return DE?.rating ? DE?.rating : null;
};

export const getMovieCertificate = (data: MovieReleaseDatesResponse) => {
  const DE = find(data?.results!, { iso_3166_1: 'DE' });
  if (!DE) return null;

  const release_dates = DE?.release_dates!;

  const important: ReleaseDate[] = sortByKey(
    release_dates?.filter(({ certification }) => certification !== ''),
    'type'
  ).reverse();

  return important?.[0]?.certification ? important?.[0]?.certification : null;
};

export const getCertificate = (item: any, isMovie: boolean) => {
  if (isMovie) return getMovieCertificate(item?.release_dates);
  if (!isMovie) return getTvCertificate(item?.content_ratings);
  return null;
};

export const getWatchProvidersFromBase = (response: any) => {
  const arr = (response?.results?.AT?.flatrate ? response?.results?.AT?.flatrate : []).concat(
    response?.results?.AT?.ads ? response?.results?.AT?.ads : []
  );

  return arr?.length > 0 ? arr : null;
};

export const removeDuplicates = <T>(arr: T[]): T[] => {
  return arr.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
};

export function getYearNumbers(year: number | string): FilterQuery<ItemProps> {
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

export const convertMinutes = (mins: number) => {
  let hours: string | number = Math.floor(mins / 60);
  let minutes: string | number = mins % 60;

  if (hours < 1) {
    hours = '';
  } else if (hours == 1) {
    hours = hours + ' Stunde ';
  } else {
    hours = hours + ' Stunden ';
  }

  if (minutes < 1) {
    minutes = '';
  } else if (minutes == 1) {
    minutes = minutes + ' Minute';
  } else {
    minutes = minutes + ' Minuten';
  }

  return `${hours} ${minutes}`;
};
