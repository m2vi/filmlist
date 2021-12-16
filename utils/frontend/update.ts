import { basicFetch } from '@utils/fetch';
import { ItemProps } from '@utils/types';
import { Dispatch, SetStateAction } from 'react';

export interface UpdateResponse {
  stats: UpdateStats;
  performance: UpdatePerfomance;
}
export interface UpdateStats {
  errors?: Array<{
    id: number;
    name: string;
    message: any;
  }>;
  modified?: Array<{
    id: number;
    name: string;
  }>;
  updated: Array<{
    id: number;
    name: string;
  }>;
  time: Array<number>;
  total_length?: number;
}

export interface UpdatePerfomance {
  start: number;
  end: number;
}

export interface UpdateBase {
  id: number;
  type: number;
}

export interface UpdateRouteResponse {
  identifier: {
    id_db: number;
    type: number;
  };
  modified: boolean;
  error: string | null | unknown;
}

class Update {
  isRunning: boolean;
  performance: UpdatePerfomance;
  stats: UpdateStats;
  interval: NodeJS.Timer;
  constructor(public items: ItemProps[], private resCb: Dispatch<SetStateAction<UpdateResponse>>) {
    this.isRunning = false;
    this.performance = {
      start: 0,
      end: 0,
    };
    this.stats = {
      errors: [],
      modified: [],
      updated: [],
      time: [],
      total_length: items.length,
    };
    this.interval = setInterval(
      () =>
        resCb({
          stats: this.stats,
          performance: this.performance,
        }),
      2000
    );
  }

  async updateEntry({ id, type }: UpdateBase): Promise<UpdateRouteResponse> {
    return await basicFetch(`/api/manage/update/${type === 1 ? 'movie' : 'tv'}/${id}`);
  }

  async start() {
    this.isRunning = true;
    this.performance.start = performance.now();

    for (const index in this.items) {
      if (!this.isRunning) break;
      const start = performance.now();
      const { id_db, type, original_name } = this.items[index];
      try {
        const { modified, error } = await this.updateEntry({ id: id_db, type });
        if (error) throw Error(error as any);
        if (modified) this.stats.modified?.push({ id: id_db, name: original_name });
      } catch ({ message }) {
        this.stats.errors?.push({
          id: id_db,
          name: original_name,
          message: message!,
        });
      }
      this.stats.updated.push({
        id: id_db,
        name: original_name,
      });
      this.stats.time.push(performance.now() - start);
    }

    this.performance.end = performance.now();
  }

  stop() {
    this.isRunning = false;
    this.performance.end = performance.now();
    clearInterval(this.interval);
  }
}

export default Update;
