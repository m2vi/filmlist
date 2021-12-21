import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.token || (req.headers as any).get('authorization');

    res.status(200).json(jwt.decode(token));
  } catch ({ message }: any) {
    res.status(500).json({ error: message });
  }
}
