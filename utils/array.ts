export const sortByKey = (array: Array<any>, key?: string, key2?: string) => {
  if (array && key && !key2) {
    return array.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
  } else if (array && key && key2) {
    return array.sort((a, b) => (a[key][key2] > b[key][key2] ? 1 : b[key][key2] > a[key][key2] ? -1 : 0));
  } else {
    return array.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
  }
};

export const removeDuplicates = (array: Array<any>) => {
  return array.filter((v, i) => array.indexOf(v) == i);
};

export const searchArray = (array: any[], key: string, value: any) => {
  if (array && key) {
    return array.filter((item) => item[key] === (value !== null ? value : item[key]));
  } else {
    return [];
  }
};

export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const removeArray = (array: any[], toRemove: any[]) => {
  return array.filter((v) => {
    return !toRemove.includes(v);
  });
};
