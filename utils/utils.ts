import { CardProps } from '@components/Card';
import colors from 'colors';

colors;

export function validateEnv<T extends string = string>(key: keyof NodeJS.ProcessEnv, defaultValue?: T, warnDefault = false): T {
  const value = process.env[key] as T | undefined;

  if (!value) {
    if (typeof defaultValue !== 'undefined') {
      if (warnDefault) {
        const message = `validateEnv is using a default value for ${key} and has this warning enabled.`;
        console.warn(message);
      }

      return defaultValue;
    } else {
      throw new Error(`${key} is not defined in environment variables`);
    }
  }

  return value;
}

export const stringToBoolean = (string: string) => {
  switch (string.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
    case null:
      return false;

    default:
      return Boolean(string);
  }
};

export const isReleased = (release_date: any) => {
  if (typeof release_date === 'number') {
    return Math.sign(new Date().getTime() - release_date) === 1;
  } else {
    return false;
  }
};

export const someIncludes = (arr1: any[] = [], arr2: any[] = []) => {
  return arr1.some((v: any) => arr2?.includes(v));
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + '…' : str;
}

export const placeholderCards = (n: number): Partial<CardProps>[] => {
  return Array.from(
    { length: n },
    (): Partial<CardProps> => ({
      isLoading: true,
    })
  );
};

export const rr = () => window.location.replace('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

export const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

interface ObjProps {
  [key: string]: any;
}

export const removeEmpty = (obj: ObjProps) => {
  const newObj: ObjProps = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return;
    newObj[key] = value;
  });

  return newObj;
};

export function getUniqueListBy(arr: any[], key: string) {
  return [...(new Map(arr.map((item) => [item[key], item])).values() as any)];
}
