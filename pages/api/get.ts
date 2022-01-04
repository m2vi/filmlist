import { client } from '@utils/themoviedb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type, c } = req.query;
    let response = {};

    if (c) {
      response = (await client.getBase(parseInt(id as string), type as any)).en;
    } else {
      response = await client.get(parseInt(id as string), type as any, {});
    }

    res.status(200).json({
      ...response,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}
