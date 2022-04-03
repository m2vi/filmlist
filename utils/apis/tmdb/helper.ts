import { sortByKey } from '@m2vi/iva';
import _ from 'lodash';
import { MovieReleaseDatesResponse, ReleaseDate, ShowContentRatingResponse, VideosResponse } from 'moviedb-promise/dist/request-types';

export const getTrailers = (videos: VideosResponse) => {
  if (!videos.results) return null;

  return videos.results.filter(({ site, type }) => site === 'YouTube' && type === 'Trailer');
};

export const getTvCertificate = (data: ShowContentRatingResponse) => {
  const DE = _.find(data?.results!, { iso_3166_1: 'DE' });
  if (!DE) return null;

  return DE?.rating ? DE?.rating : null;
};

export const getMovieCertificate = (data: MovieReleaseDatesResponse) => {
  const DE = _.find(data?.results!, { iso_3166_1: 'DE' });
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
