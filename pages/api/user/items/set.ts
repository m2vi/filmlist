import user from '@apis/user';
import { isMovie } from '@helper/main';
import { stringToBoolean } from '@m2vi/iva';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client_id = user.getIdFromRequest(req, true);

    const { id, type, state, move } = Object.freeze(req.query);

    res
      .status(200)
      .json(
        await user.set(
          client_id,
          parseInt(id.toString()),
          isMovie(type.toString()) ? 1 : 0,
          parseInt(state.toString()),
          stringToBoolean(move.toString()) as boolean
        )
      );
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
