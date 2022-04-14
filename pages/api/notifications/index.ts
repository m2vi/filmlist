import filmlist from '@utils/apis/filmlist';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale } = Object.freeze(req.query);

    const tab = await filmlist.getTab({
      user: '',
      tab: 'notifications',
      locale: locale.toString(),
      start: 0,
      end: 50,
      purpose: 'items_f',
    });

    res.status(200).json(
      tab.items.map(({ id_db, type, name, release_date, backdrop_path }) => {
        return { id_db, type, name, release_date, backdrop_path };
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
}
