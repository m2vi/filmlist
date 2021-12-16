import itemSchema from '@models/itemSchema';
import client from '@utils/themoviedb/api';
import { MovieDbTypeEnum } from '@utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id_db = parseInt(`${req.query.id_db}`);
  const type = parseInt(MovieDbTypeEnum[`${req.query.type}` as any]);

  try {
    const n: any = await client.dataForUpdate(id_db, type);
    const { modifiedCount } = await itemSchema.updateOne(
      { id_db, type },
      {
        ...n,
      }
    );

    res.status(200).json({
      identifier: {
        id_db,
        type,
      },
      modified: modifiedCount ? true : false,
      error: null,
    });
  } catch ({ message }) {
    res.status(500).json({
      identifier: {
        id_db,
        type,
      },
      modified: false,
      error: message,
    });
  }
}
