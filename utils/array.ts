import _ from 'lodash';

export const sortByKey = (array: Array<any>, path: string) => {
  return array.sort((a, b) => (_.get(a, path) > _.get(b, path) ? 1 : _.get(b, path) > _.get(a, path) ? -1 : 0));
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

export const shuffle = (array: any[]) => {
  return _.shuffle(array);
};

export const removeArray = (array: any[], toRemove: any[]) => {
  return array.filter((v) => {
    return !toRemove.includes(v);
  });
};
