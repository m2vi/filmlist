import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, locale = 'en' } = Object.freeze(req.query);

    const client = await user.find(user.getIdFromRequest(req));

    const data = await filmlist.getPerson(parseInt(id.toString()), locale.toString(), client);

    res.status(200).json(data);
  } catch (error) {
    res.status(200).json([]);
  }
}
