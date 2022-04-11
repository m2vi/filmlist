import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { custom_config, ...data } = Object.freeze(req.query) as any;
  const id = user.getIdFromRequest(req);

  res.status(200).json(await filmlist.getTab({ ...data, user: id, custom_config: custom_config ? JSON.parse(custom_config) : undefined }));
}
