import filmlist from '@utils/apis/filmlist';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { custom_config, ...data } = Object.freeze(req.query) as any;

  res.status(200).json(await filmlist.getTab({ ...data, custom_config: custom_config ? JSON.parse(custom_config) : undefined }));
}
