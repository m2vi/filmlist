import filmlist from '@utils/apis/filmlist';
import genres from '@utils/apis/genres';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, locale } = Object.freeze(req.query);
    const client_id = user.getIdFromRequest(req);

    const data = await filmlist.getTab({
      user: client_id,
      tab: genres.getName(parseInt(id.toString())).toLowerCase(),
      start: 0,
      end: 20,
      locale: locale.toString(),
      custom_config: {
        filter: {
          genre_ids: parseInt(id.toString()),
        },
        reverse: true,
        hide_unreleased: true,
        minVotes: 50,
      },
      purpose: 'items_f',
      shuffle: true,
    });

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error?.message });
  }
}
