import main from '@apis/main';
import user from '@apis/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = (
    await main.getTab({
      user: user.getIdFromRequest(req),
      start: 0,
      end: Number.MAX_SAFE_INTEGER,
      locale: 'de',
      purpose: 'items_l',
      tab: 'und',
      custom_config: {
        sort_key: false,
      },
    })
  ).items;
  const client = user.getIdFromRequest(req);

  let results: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const { id_db, type } = data[i];

    console.log(await user.set(client, id_db, type, -1, true));
  }

  await user.updateIndex(client);

  res.status(200).json(results);
}
