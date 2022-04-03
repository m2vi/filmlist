import { MovieDbTypeEnum } from '@Types/items';

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
