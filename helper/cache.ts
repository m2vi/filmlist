import attr from '@apis/attr';
import main from '@apis/main';
import mongodb from '@apis/mongodb';
import { ItemProps, TabsType } from '@Types/items';
import tabs from '@data/tabs.json';

export const config = {
  items_local: {
    key: 'items_local',
    data: async () => await main.local_items(),
  },
  providers: {
    key: 'providers',
    data: async () => await main.providers(),
  },
  items_f: {
    key: 'items_f',
    data: async () => {
      await mongodb.init();

      return await mongodb.itemSchema.find().select(attr.items_f).lean<ItemProps[]>();
    },
  },
  items_l: {
    key: 'items_l',
    data: async () => await main.local_items(),
  },
  items: {
    key: 'items',
    data: async () => {
      await mongodb.init();

      return await mongodb.itemSchema.find().lean<ItemProps[]>();
    },
  },
  items_m: {
    key: 'items_m',
    data: async () => {
      await mongodb.init();

      return await mongodb.itemSchema.find().select(attr.items_m).lean<Array<Partial<ItemProps>>>();
    },
  },
  companies: {
    key: 'companies',
    data: async () => await main.productionCompanies(),
  },
  genres: {
    key: 'genres',
    data: async () => await main.genres(),
  },
  tabs: {
    key: 'tabs',
    data: async (): Promise<TabsType> => tabs,
  },
  persons: {
    key: 'persons',
    data: async () => await main.persons(),
  },
};
