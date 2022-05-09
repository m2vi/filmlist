import { FrontendItemProps, ItemProps } from '@Types/items';

class Attributes {
  get items_f(): Array<keyof ItemProps> {
    return [
      'original_name',
      'popularity',
      'rated',
      'watchProviders',
      'original_language',
      'keywords',
      'production_companies',
      'collection',
      'external_ids',
      ...this.frontendItems,
    ];
  }

  get frontendItems(): Array<keyof FrontendItemProps> {
    return ['id_db', 'genre_ids', 'name', 'poster_path', 'backdrop_path', 'release_date', 'runtime', 'type', 'ratings'];
  }

  get items_m(): Array<keyof ItemProps> {
    return ['id_db', 'type', 'external_ids'];
  }
}

export const attr = new Attributes();
export default attr;
