import { connectToDatabase } from '@utils/database';
import { MovieDbTypeEnum } from '@utils/types';
import { Connection } from 'mongoose';

class Helper {
  async dbInit(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }

  isMovie(type: any) {
    return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
  }

  sumId(id: number, type: MovieDbTypeEnum) {
    return `${id}:${this.isMovie(type) ? 1 : 0}`;
  }
}

export const helper = new Helper();
export default helper;
