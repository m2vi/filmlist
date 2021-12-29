import type { NextApiRequest, NextApiResponse } from 'next';
import companies from '@data/companies.json';
import config from '@data/config.json';
import genres from '@data/genres.json';
import streaming from '@data/streaming.json';
import tabs from '@data/streaming.json';
import tmdb from '@data/tmdb.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    companies,
    config,
    genres,
    streaming,
    tabs,
    tmdb,
  });
}
