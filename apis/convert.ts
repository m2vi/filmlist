import { isAnime, isMovie, parseExternalIds } from '@helper/main';
import { BaseResponse, FrontendItemProps, ItemProps } from '@Types/items';
import info from './info';
import posters from '@data/posters.json';
import { SimpleObject } from '@Types/common';

const getAlternativePoster = ({
  id_db,
  type,
  poster_path,
  locale,
}: {
  id_db: number;
  type: number;
  poster_path: string | null;
  locale: string;
}) => {
  const list = posters as SimpleObject<SimpleObject<string>>;
  const alt = list?.[type === 1 ? 'movie' : 'tv']?.[id_db.toString()];

  return locale === 'de' ? (alt ? alt : poster_path) : poster_path;
};

const FromBaseToItem = (data: BaseResponse): ItemProps => {
  const { tmdb_item, translation_de, certificate, isMovie, watchProviders, trailers, ratings, imdb_item, rt_item, imdb_keywords } = data;

  return {
    budget: tmdb_item?.budget ? tmdb_item?.budget : null,
    revenue: tmdb_item?.revenue ? tmdb_item?.revenue : null,
    tagline: tmdb_item?.tagline ? tmdb_item?.tagline : null,
    summary: imdb_item?.summary ? imdb_item?.summary : null,
    created_by: tmdb_item?.created_by ? tmdb_item?.created_by : null,
    production_companies: tmdb_item?.production_companies,
    status: tmdb_item?.status ? tmdb_item?.status : null,
    rated: certificate,
    external_ids: parseExternalIds(tmdb_item?.external_ids, rt_item),
    overview: {
      en: tmdb_item?.overview ? tmdb_item?.overview : '',
      de: translation_de?.overview ? translation_de?.overview : '',
    },
    genre_ids: (isAnime(tmdb_item) ? [7424] : []).concat(
      tmdb_item?.genres ? tmdb_item?.genres?.map(({ id }: any) => id) : tmdb_item.genre_ids
    ),
    id_db: parseInt(tmdb_item?.id as any),
    name: {
      en: tmdb_item?.title ? tmdb_item?.title : tmdb_item?.name,
      de: translation_de?.name,
    },
    original_language: tmdb_item?.original_language,
    original_name: isMovie ? tmdb_item?.original_title : tmdb_item?.original_name,
    poster_path: {
      en: tmdb_item.poster_path ? tmdb_item.poster_path : null,
      de: translation_de.poster_path,
    },
    backdrop_path: {
      en: tmdb_item.backdrop_path ? tmdb_item.backdrop_path : null,
      de: translation_de.backdrop_path,
    },
    release_date: new Date(isMovie ? tmdb_item?.release_date : tmdb_item?.first_air_date).getTime(),
    runtime: (isMovie ? tmdb_item?.runtime : tmdb_item?.episode_run_time ? tmdb_item?.episode_run_time?.[0] : null)
      ? isMovie
        ? tmdb_item?.runtime
        : tmdb_item?.episode_run_time[0]
      : null,
    type: isMovie ? 1 : 0,
    credits: tmdb_item?.credits,
    keywords: tmdb_item?.keywords?.keywords ? tmdb_item?.keywords?.keywords : [],
    imdb_keywords: imdb_keywords ? imdb_keywords : [],
    watchProviders,
    collection: isMovie ? (tmdb_item.belongs_to_collection ? tmdb_item.belongs_to_collection : null) : null,
    trailers: trailers,
    ratings: ratings,
    number_of_episodes: tmdb_item?.number_of_episodes ? tmdb_item?.number_of_episodes : null,
    number_of_seasons: tmdb_item?.number_of_seasons ? tmdb_item?.number_of_seasons : null,
    popularity: tmdb_item.popularity ? tmdb_item.popularity : null,
    updated_at: null,
  };
};

export const FromItemToFrontend = (
  {
    id_db,
    genre_ids,
    name,
    poster_path,
    backdrop_path,
    release_date,
    ratings,
    type,
    similarity_score,
    user_state,
    user_rating,
    user_date_added,
    runtime,
    external_ids,
    overview,
    rated,
    popularity,
    original_language,
    details,
  }: ItemProps,
  locale: string = 'en'
): FrontendItemProps => {
  return {
    id_db: id_db,
    genre_ids: genre_ids ? genre_ids : [],
    name: name?.[locale] ? name?.[locale] : 'Invalid name',
    poster_path: getAlternativePoster({ id_db, type, poster_path: poster_path?.[locale] ? poster_path?.[locale] : null, locale }),
    backdrop_path: backdrop_path?.[locale] ? backdrop_path?.[locale] : null,
    release_date: release_date ? release_date : new Date().getTime(),
    runtime: runtime ? runtime : null,
    ratings: ratings ? ratings : null,
    type: isMovie(type) ? 1 : 0,
    overview: overview?.[locale] ? overview?.[locale] : null,
    external_ids,
    rated: rated ? rated : null,
    popularity: popularity,
    original_language: original_language,
    details: info.format(details),

    ...(typeof user_state !== 'undefined' ? { user_state } : {}),
    ...(typeof user_rating !== 'undefined' ? { user_rating } : {}),
    ...(typeof user_date_added !== 'undefined' ? { user_date_added } : {}),
  };
};

export const FromTmdbToFrontend = (i: any): FrontendItemProps => {
  const isMovie = i?.title ? true : false;

  return {
    id_db: parseInt(i?.id as any),
    genre_ids: (isAnime(i) ? [7424] : []).concat(i?.genres ? i?.genres?.map(({ id }: any) => id) : i.genre_ids),
    name: i?.title ? i?.title : i?.name,
    poster_path: i.poster_path ? i.poster_path : null,
    backdrop_path: i.backdrop_path ? i.backdrop_path : null,
    release_date: new Date(isMovie ? i?.release_date : i?.first_air_date).getTime(),
    runtime: i?.runtime ? i?.runtime : null,
    ratings: {
      tmdb: {
        vote_average: i?.vote_average,
        vote_count: i?.vote_count,
      },
    },
    type: isMovie ? 1 : 0,
    overview: i?.overview ? i?.overview : null,
    external_ids: {},
    rated: i?.rated ? i?.rated : null,
    popularity: i?.popularity ? i?.popularity : null,
    original_language: i?.original_language ? i?.original_language : null,
    details: null,
  };
};

export class Convert {
  get fromBaseToItem() {
    return FromBaseToItem;
  }

  get fromItemToFrontend() {
    return FromItemToFrontend;
  }

  get fromTmdbToFrontend() {
    return FromTmdbToFrontend;
  }

  prepareForFrontend(items: ItemProps[], locale: string): FrontendItemProps[] {
    return items.map((item) => this.fromItemToFrontend(item, locale));
  }

  prepareTmdbForFrontend(items: any[]): FrontendItemProps[] {
    return items.map((item) => this.fromTmdbToFrontend(item));
  }
}

export const convert = new Convert();
export default convert;
