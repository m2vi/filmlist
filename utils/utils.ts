export const contains = <T>(arr: T[], obj: T): Boolean => {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
};

export function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + '…' : str;
}

export const arrayMove = <T>(arr: T[], oldIndex: number, newIndex: number) => {
  const element = arr[oldIndex];
  arr.splice(oldIndex, 1);
  arr.splice(newIndex, 0, element);

  return arr;
};

const isPropValuesEqual = (subject: any, target: any, propNames: any) =>
  propNames.every((propName: any) => subject[propName] === target[propName]);

export const getUniqueItemsByProperties = <T>(items: T[], propNames: string[]) => {
  const propNamesArray = Array.from(propNames);

  return items.filter((item, index, array) => index === array.findIndex((foundItem) => isPropValuesEqual(foundItem, item, propNamesArray)));
};
