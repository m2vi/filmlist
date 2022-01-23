import { cachedFetch } from '@utils/backend/fetch';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = 'https://dev.core.fluxi.ml/styles';

  const f = async (name: string) => await cachedFetch(`${baseUrl}/${name}.css`, 'text');

  const [colors, globals, components, animations] = await Promise.all([f('colors'), f('globals'), f('components'), f('animations')]);

  const text = [colors, globals, components, animations].join('\n');
  res.send(text);
}
