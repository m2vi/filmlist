import itemSchema from '@models/itemSchema';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import { LogProps } from '@utils/types';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import { performance } from 'perf_hooks';
import cliProgress from 'cli-progress';

export const logUpdate = ({
  errors,
  progress,
  updated,
  modified,
  remaining_time,
  elapsed_time,
  average_time_per_job,
  info: { id, tmdb_id },
}: LogProps) => {
  console.clear();
  console.log('Stats:'.green);
  console.log('updated:', updated.toString().blue);
  console.log('modified:', modified.toString().blue);
  console.log('errors:', `${errors}`.blue);
  console.log('');
  console.log('Current task: '.green);
  console.log('id:', id!.blue);
  console.log('tmdb id:', tmdb_id.toString().blue);
  console.log('');
  console.log('Timing:'.green);
  console.log('average time per job:', `${average_time_per_job.toFixed(2)}`.blue);
  console.log('elapsed time:', `${elapsed_time}`.blue);
  console.log('remaining time:', `${remaining_time}`.blue);
  console.log('');
  const b = new cliProgress.SingleBar({ format: '{bar}'.blue + ' {percentage}%' });
  b.start(100, progress);
  console.log('');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const docs = await api.find({});
  const length = docs.length;
  const total_start = performance.now();
  let modified = 0;
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
          index: parseInt(index),
        }
      );
      modified += result.modifiedCount;
    } catch (error: any) {
      errors.push({
        message: `ERROR - ${_id?.toString()} - ${error.message}`,
      });
      console.log(`ERROR - ${_id?.toString()} - ${error.message}`);
    }

    const end = performance.now() - start;
    updated += 1;
    times.push(end);

    const log: LogProps = {
      progress: (100 * (parseInt(index) + 1)) / length,
      remaining_time: moment(calculateTimeRemaining()).format('mm:ss'),
      elapsed_time: moment(calculateTimeElapsed()).format('mm:ss'),
      average_time_per_job: times.reduce((b, a) => b + a, 0) / times.length,
      errors: errors.length,
      modified,
      updated,
      info: {
        id: _id?.toString(),
        tmdb_id: id_db,
      },
    };

    logUpdate(log);
  }

  res.json({
    success: true,
  });
}
