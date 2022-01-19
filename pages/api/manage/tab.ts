import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@utils/backend/api';
import { stringToBoolean } from '@utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ...props } = Object.freeze(req.query) as any;

  res.status(200).json(
    await api.getTab({
      tab: props.tab,
      locale: props.locale,
      start: parseInt(props.start),
      end: parseInt(props.end),
      release_year: props.release_year,
      custom_config: props.custom_config && JSON.parse(props.custom_config),
      dontFrontend: props.dontFrontend && stringToBoolean(props.dontFrontend),
      purpose: props.purpose,
      includeCredits: props.includeCredits && stringToBoolean(props.includeCredits),
    })
  );
}
