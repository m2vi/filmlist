import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = Object.freeze(req.query);

    res.status(200).json(await user.get(id.toString()));
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
