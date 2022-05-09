import { sortByKey, stringToBoolean } from '@m2vi/iva';
import { ItemProps } from '@Types/items';
import { FilterProps } from '@Types/user';
import filmlist from '@utils/apis/filmlist';
import convert from '@utils/convert/main';
import { isMovie, isValidId, isValidType } from '@utils/helper/tmdb';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';
import _ from 'underscore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    filters,
    purpose = 'items',
    lazy,
    convert: doConvert,
    locale = 'en',
  } = _.has(req.query, 'filters') ? Object.freeze(req.query) : Object.freeze(req.body);
  const client = await user.getIdFromRequest(req);

  try {
    const base = JSON.parse(filters.toString());
    if (!Array.isArray(base) || base.length <= 0) throw Error('User input malformed (2)');

    const arr: Partial<ItemProps>[] = base
      .filter((item: Partial<FilterProps>) => (isValidType(item.type) && isValidId(item.id)) || item.imdb_id)
      .map((item: FilterProps) => {
        if (item.imdb_id) {
          return {
            'external_ids.imdb_id': item.imdb_id,
          };
        } else {
          return {
            id_db: parseInt(item.id as any),
            type: isMovie(item.type) ? 1 : 0,
          };
        }
      });

    if (arr.length <= 0) throw Error('User input malformed');

    const items = await filmlist.find(
      {
        filter: { $or: arr },
        purpose: purpose ? (purpose.toString() as any) : 'items',
        sort: {
          key: `name.${locale ? locale.toString() : 'en'}`,

          order: 1,
        },
        slice: [0, Number.MAX_SAFE_INTEGER],
      },
      client
    );

    if (stringToBoolean(doConvert ? doConvert?.toString() : '')) {
      res.status(200).json(convert.prepareForFrontend(items, locale.toString()));
    } else {
      res.status(200).json(items);
    }
  } catch (error: any) {
    if (stringToBoolean(lazy ? lazy?.toString() : '')) {
      res.status(200).json([]);
    } else {
      res.status(500).json({ message: error?.message });
    }
  }
}

//! fix exists
