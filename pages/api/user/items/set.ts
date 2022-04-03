import { stringToBoolean } from '@m2vi/iva';
import { isMovie } from '@utils/helper/tmdb';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client_id = user.getIdFromRequest(req, true);

    const { id, type, rating, state, move } = Object.freeze(req.query);

    const data = {
      id: parseInt(id.toString()),
      type: isMovie(type.toString()) ? 1 : 0,
      rating: rating.toString() === 'null' ? null : parseFloat(rating.toString()),
      state: parseInt(state.toString()),
    };

    res
      .status(200)
      .json(
        await user.setItem(
          client_id,
          { filter: { id: data.id, type: data.type }, index: 0, rating: data.rating, state: data.state },
          stringToBoolean(move.toString()) as boolean
        )
      );
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
