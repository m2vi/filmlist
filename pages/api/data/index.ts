import type { NextApiRequest, NextApiResponse } from 'next';
import certificates from '@data/certificates.json';
import companies from '@data/companies.json';
import config from '@data/config.json';
import genres from '@data/genres.json';
import providers from '@data/providers.json';
import streaming from '@data/streaming.json';
import tabs from '@data/streaming.json';
import tmdb from '@data/tmdb.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    certificates,
    companies,
    config,
    genres,
    providers,
    streaming,
    tabs,
    tmdb,
  });
}
