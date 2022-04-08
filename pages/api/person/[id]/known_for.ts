import { sortByKey } from '@m2vi/iva';
import tmdb from '@utils/apis/tmdb';
import convert from '@utils/convert/main';
import { getUniqueListBy } from '@utils/helper';
import user from '@utils/user';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, locale = 'en' } = Object.freeze(req.query);

    const client = await user.find(user.getIdFromRequest(req));

    const { cast, crew } = (await tmdb.api.personCombinedCredits({ id: id.toString(), language: locale.toString() })) as any;

    const data = user.appendUserAttributes(convert.prepareTmdbForFrontend(sortByKey([...cast, ...crew], 'vote_count').reverse()), client);
    res.status(200).json(getUniqueListBy(data, 'name'));
  } catch (error) {
    res.status(200).json([]);
  }
}
