import { TabsType } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import db from '@utils/db/main';
import attr from '../filmlist/attributes';
import fsm from '../filmlist/small';
import jsonTabs from '@data/tabs.json';

export const config = {
  companies: {
    key: 'companies',
    data: async () => await fsm.productionCompanies(),
  },
  items_f: {
    key: 'items_f',
    data: async () => {
      await db.init();

      return await db.itemSchema.find().select(attr.items_f).lean<ItemProps[]>();
    },
  },
  items: {
    key: 'items',
    data: async () => {
      await db.init();

      return await db.itemSchema.find().lean<ItemProps[]>();
    },
  },
  items_m: {
    key: 'items_m',
    data: async () => {
      await db.init();

      return await db.itemSchema.find().select(attr.items_m).lean<Array<Partial<ItemProps>>>();
    },
  },
  genres: {
    key: 'genres',
    data: async () => await fsm.genres(),
  },
  tabs: {
    key: 'tabs',
    data: async (): Promise<TabsType> => jsonTabs,
  },
  persons: {
    key: 'persons',
    data: async () => await fsm.persons(),
  },
  providers: {
    key: 'providers',
    data: async () => await fsm.providers(),
  },
};
