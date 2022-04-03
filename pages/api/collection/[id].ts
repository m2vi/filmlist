import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, locale } = Object.freeze(req.query);

  const client = await user.find(user.getIdFromRequest(req));

  res.status(200).json(await filmlist.getCollection(parseInt(id.toString()), locale.toString(), client));
}
