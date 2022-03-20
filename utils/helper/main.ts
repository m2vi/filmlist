import { connectToDatabase } from '@utils/database';
import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { Connection } from 'mongoose';

export class Helper {
  async dbInit(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }

  isMovie(type: any) {
    return (MovieDbTypeEnum[type] as any) === MovieDbTypeEnum.movie || type.toString() === '1';
  }

  sumId({ id_db, type }: Partial<ItemProps>) {
    return `${id_db}:${this.isMovie(type) ? 1 : 0}`;
  }
}

export const helper = new Helper();
export default helper;
