import sift from 'sift';
import resolutions from '@data/resolutions.json';

export const gcd = (a: number, b: number): number => {
  return b == 0 ? a : gcd(b, a % b);
};

export const calculateAspectRatio = (a: number, b: number) => {
  const r = gcd(a, b);

  return [a / r, b / r];
};

export const getResolution = (resolution: number[] | null) => {
  const resName = resolutions.find(
    sift<typeof resolutions[0]>({
      $or: [{ width: resolution?.[0].toString() }, { height: resolution?.[1].toString() }],
    })
  )?.name;

  return resName;
};

export const round = (n: number): number => {
  return Math.round((n + Number.EPSILON) * 100) / 100;
};
