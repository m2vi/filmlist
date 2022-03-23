import { connectToDatabase } from '@utils/database';
import { ItemProps, MovieDbTypeEnum } from '@utils/types';
import { toString } from 'lodash';
import { Connection } from 'mongoose';

export class Helper {
  async dbInit(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }

  isValidId(value: any) {
    return toString(value) === toString(parseInt(toString(value)));
  }

  isValidType(type: any) {
    return ['movie', 'tv', 1, 0, '1', '0'].includes(type);
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
