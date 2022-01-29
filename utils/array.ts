import _ from 'lodash';

export const sortByKey = (array: Array<any>, path: string) => {
  if (!path) {
    return array.sort((a, b) => a - b);
  } else {
    return array.sort((a, b) => (_.get(a, path) > _.get(b, path) ? 1 : _.get(b, path) > _.get(a, path) ? -1 : 0));
  }
};

export const removeDuplicates = (array: Array<any>): any[] => {
  return array.reduce((acc, curr) => (acc.includes(curr) ? acc : [...acc, ...[curr]]), []);
};

export const searchArray = (array: any[], key: string, value: any) => {
  if (array && key) {
    return array.filter((item) => item[key] === (value !== null ? value : item[key]));
  } else {
    return [];
  }
};

export const removeArray = (array: any[], toRemove: any[]) => {
  return array.filter((v) => {
    return !toRemove.includes(v);
  });
};

export const shuffle = (inArr: any[], seed: any, unshuffle = false) => {
    let outArr = Array.from(inArr),
      len = inArr.length;

    let swap = (a: any, b: any) => ([outArr[a], outArr[b]] = [outArr[b], outArr[a]]);

    for (var i = unshuffle ? len - 1 : 0; (unshuffle && i >= 0) || (!unshuffle && i < len); i += unshuffle ? -1 : 1)
      swap(seed[i % seed.length] % len, i);

    return outArr;
  },
  unshuffle = (inArr: any[], seed: any) => shuffle(inArr, seed, true);
