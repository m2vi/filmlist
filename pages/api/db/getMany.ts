import main from '@apis/main';
import user from '@apis/user';
import { stringToBoolean } from '@m2vi/iva';
import { NextApiRequest, NextApiResponse } from 'next';
import has from 'lodash/has';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filters, purpose, lazy, convert, locale } = has(req.query, 'filters') ? Object.freeze(req.query) : Object.freeze(req.body);
  const client = await user.find(user.getIdFromRequest(req)!);

  try {
    const data = await main.getMany(
      client,
      JSON.parse(filters.toString()),
      purpose ? purpose : 'items',
      Boolean(stringToBoolean(convert)),
      locale
    );

    res.status(200).json(data);
  } catch (error: any) {
    if (stringToBoolean(lazy ? lazy?.toString() : '')) {
      res.status(200).json([]);
    } else {
      res.status(500).json({ message: error?.message });
    }
  }
}

//! fix exists
