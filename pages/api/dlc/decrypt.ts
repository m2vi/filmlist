import dlc from '@apis/dlc';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: `request method '${req.method}' not supported` });
  if (!req.body) return res.status(400).json({ error: 'given body is empty' });

  const data = await dlc.paste(req.body);

  if (Object.hasOwn(data, 'error')) return res.status(500).json(data);

  if (Object.hasOwn(req.query, 'prepare')) return res.status(200).send(data?.join('\n'));

  res.status(200).json(data);
}
