import type { NextApiRequest, NextApiResponse } from 'next';
import search from '@utils/apis/search';
import user from '@utils/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, locale, page = 'filmlist' } = Object.freeze(req.query);
    const id = user.getIdFromRequest(req);

    res.status(200).json(await search.get({ query: query.toString(), locale: locale.toString(), page: page.toString(), user_id: id }));
  } catch (error: any) {
    res.status(500).json([]);
  }
}
