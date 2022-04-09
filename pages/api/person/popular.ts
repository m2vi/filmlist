import tmdb from '@utils/apis/tmdb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { locale, page } = Object.freeze(req.query);

    const data = await tmdb.api.personPopular({ id: '', language: locale.toString(), page: parseInt(page.toString()) });
    const result = data.results?.map(({ id, name, popularity, profile_path }) => {
      return {
        id,
        name,
        popularity,
        profile_path,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json([]);
  }
}
