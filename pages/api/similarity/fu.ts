import similarity from '@utils/similarity';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale } = Object.freeze(req.query);

    res.status(200).json(await similarity.getForYou(user.getIdFromRequest(req), locale.toString(), 0, 20));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
