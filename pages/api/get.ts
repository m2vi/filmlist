import { client } from '@utils/tmdb/api';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, type, c } = req.query;
    let response = {};

    if (c) {
      response = await client.getBase(parseInt(id as string), type as any);
    } else {
      response = await client.get(parseInt(id as string), type as any, { state: null });
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
