import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import { performance } from 'perf_hooks';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const length = docs.length;
  const total_start = performance.now();
  let modified = 0;
  let modifiedIds = [];
  let updated = 0;
  let errors = [];
  let times: number[] = [];

  const calculateTimeRemaining = () => {
    const average = times.reduce((b, a) => b + a, 0) / times.length;
    const result = average * (length - updated);
    return result;
  };

  const calculateTimeElapsed = () => {
    return performance.now() - total_start;
  };

  for (const index in docs) {
    const { _id, id_db, type, name } = docs[index];
    const start = performance.now();

    try {
      const n: any = await client.dataForUpdate(id_db, type);
      const result = await itemSchema.updateOne(
        { id_db, type },
        {
          ...n,
        }
      );
      modified += result.modifiedCount;
      result.modifiedCount && modifiedIds.push(name.en ? name.en : name);
    } catch (error: any) {
      errors.push({
        message: `ERROR - ${_id?.toString()} - ${error.message}`,
      });
      console.log(`ERROR - ${_id?.toString()} - ${error.message}`);
    }

    const end = performance.now() - start;
    updated += 1;
    times.push(end);

    const log = {
      progress: `${((100 * (parseInt(index) + 1)) / length).toFixed(2)}%`,
      remaining_time: moment(calculateTimeRemaining()).format('mm:ss'),
      elapsed_time: moment(calculateTimeElapsed()).format('mm:ss'),
      average_time_per_job: `${end.toFixed(2)}ms`,
      info: {
        id: _id?.toString(),
        tmdb_id: id_db,
      },
    };

    console.log(JSON.stringify(log));
  }

  res.json({
    updated,
    modified: {
      count: modified,
      modifiedIds,
    },
    time: performance.now() - total_start,
  });
}
