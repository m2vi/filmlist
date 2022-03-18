import { ItemProps } from '@utils/types';

export const toDictionary = (items: ItemProps[], property: keyof ItemProps) => {
  const dictionary: any = {};

  items.forEach((item) => {
    ((item[property] || []) as any[]).forEach((innerValue) => {
      if (!dictionary[innerValue.id]) {
        dictionary[innerValue.id] = {
          ...innerValue,
          count: 1,
        };
      } else {
        dictionary[innerValue.id] = {
          ...dictionary[innerValue.id],
          count: dictionary[innerValue.id].count + 1,
        };
      }
    });
  });
};
