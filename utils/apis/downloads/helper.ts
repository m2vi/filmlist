export const round = (n: number): number => {
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

export const gcd = (a: number, b: number): number => {
  return b == 0 ? a : gcd(b, a % b);
};

export const calculateAspectRatio = (a: number, b: number) => {
  const r = gcd(a, b);

  return [a / r, b / r];
};
