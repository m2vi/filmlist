import { connectToDatabase } from '@utils/database';
import { Connection } from 'mongoose';

class Helper {
  async dbInit(): Promise<Connection | undefined> {
    return await connectToDatabase();
  }
}

export const helper = new Helper();
export default helper;
