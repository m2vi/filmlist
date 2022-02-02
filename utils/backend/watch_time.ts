import { ItemProps } from '@utils/types';
import moment from 'moment';
import { FilterQuery } from 'mongoose';
import sift from 'sift';
import api from './api';

class WatchTime {
  constructor(private attributes: string[] = ['runtime', 'number_of_episodes', 'number_of_seasons', 'type', 'ratings', 'state']) {}

  private filter(items: any[], siftQuery: FilterQuery<ItemProps>) {
    return items.filter(sift(siftQuery));
  }

  private grd(items: Partial<ItemProps>[]) {
    const movies = this.filter(items, { type: 1 }).reduce((prev, curr) => {
      return prev + (curr?.runtime ? curr?.runtime : 0);
    }, 0);
    const shows = this.filter(items, { type: 0 }).reduce((prev, curr) => {
      return prev + (curr?.runtime ? curr?.runtime : 0) * (curr?.number_of_episodes ? curr?.number_of_episodes : 0);
    }, 0);

    return { all: movies + shows, movies, 'tv shows': shows };
  }

  private gr(items: Partial<ItemProps>[]) {
    const d = this.grd(items);

    return {
      all: moment.duration(d.all, 'minutes').format('D [Days] H [Hours]'),
      movies: moment.duration(d.movies, 'minutes').format('D [Days] H [Hours]'),
      'tv shows': moment.duration(d['tv shows'], 'minutes').format('D [Days] H [Hours]'),
    };
  }

  private async items(filter: FilterQuery<ItemProps>) {
    return await api.schema.find(filter).select(this.attributes).lean();
  }

  async get() {
    const items = await this.items({});

    const filter = (filter: FilterQuery<ItemProps> = {}) => this.gr(this.filter(items, filter));

    return {
      average: {
        movies: moment.duration(this.grd(items).movies / this.filter(items, { type: 1 }).length, 'minutes').format('H [Hours] m [Minutes]'),
        'tv shows': moment
          .duration(this.grd(items)['tv shows'] / this.filter(items, { type: 0 }).length, 'minutes')
          .format('H [Hours] m [Minutes]'),
      },
      all: filter({}),
      watched: filter({ state: { $gt: 0 } }),
      unwatched: filter({ state: { $lt: 0 } }),
      ltv: filter({ state: -2 }),
    };
  }
}

export const watchtime = new WatchTime();
export default watchtime;
