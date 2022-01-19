import { api } from '@utils/tmdb/api';
import companies from '@data/companies.json';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let data = {} as any;

  for (const index in companies.ids) {
    try {
      const id = companies.ids[index];

      const { name, homepage } = await api.companyInfo({ id, language: 'en' });

      data[id] = {
        id,
        name,
        homepage,
      };
    } catch (error) {}
  }

  res.status(200).json({
    ids: Object.keys(data).map((id) => parseInt(id)),
    data,
  });
}
