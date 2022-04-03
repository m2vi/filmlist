import { ItemProps } from '@Types/items';
import { isMovie } from './tmdb';

export function getUniqueListBy(arr: any[], key: string) {
  return [...(new Map(arr.map((item) => [item[key], item])).values() as any)];
}

export function checkUndefined<T, K>(value: T, defaultValue: K): T | K {
  if (typeof value === 'undefined') return defaultValue;

  return value;
}

export function sumId({ id_db, type }: Partial<ItemProps>) {
  return `${id_db}:${isMovie(type) ? 1 : 0}`;
}
