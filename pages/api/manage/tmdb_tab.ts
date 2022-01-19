import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/themoviedb/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ...props } = Object.freeze(req.query) as any;

  res.status(200).json(
    await api.getTMDBTab({
      locale: props?.locale ? props?.locale : 'en',
      page: parseInt(props?.page),
      tab: props?.tab,
      type: props?.type,
    })
  );
}
