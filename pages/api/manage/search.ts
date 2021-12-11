import type { NextApiRequest, NextApiResponse } from 'next';
import search from '@utils/backend/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pattern, locale } = req.query as any;

  const items = await search.get(pattern, {
    items: JSON.parse(req.body.items),
    locale,
  });

  res.status(200).json(items);
}
