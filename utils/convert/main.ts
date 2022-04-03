import { BaseResponse } from '@Types/filmlist';
import { FrontendItemProps, ItemProps } from '@Types/items';
import { isAnime, parseExternalIds } from '@utils/apis/filmlist/helper';
import { isMovie } from '@utils/helper/tmdb';

const FromBaseToItem = (data: BaseResponse): ItemProps => {
  const { tmdb_item, translation_de, certificate, isMovie, watchProviders, trailers, ratings, imdb_item, rt_item } = data;

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
  }: ItemProps,
  locale: string = 'en'
): FrontendItemProps => {
  return {
    id_db: id_db,
    genre_ids: genre_ids ? genre_ids : [],
    name: name?.[locale] ? name?.[locale] : 'Invalid name',
    poster_path: poster_path?.[locale] ? poster_path?.[locale] : null,
    backdrop_path: backdrop_path?.[locale] ? backdrop_path?.[locale] : null,
    release_date: release_date ? release_date : new Date().getTime(),
    runtime: runtime ? runtime : null,
    ratings: ratings ? ratings : null,
    type: isMovie(type) ? 1 : 0,

    ...(typeof similarity_score !== 'undefined' ? { similarity_score } : {}),
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
