import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    build_id: process.env.BUILD_ID,
  });
}
