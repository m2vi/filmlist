import itemSchema from '@models/itemSchema';
import ratingSchema from '@models/ratingSchema';
import userSchema from '@models/userSchema';
import mongoose from 'mongoose';

class Db {
  async init() {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: 'smarthub',
      autoIndex: true,
    });

    if (mongoose.connection) {
      return mongoose.connection;
    }
  }

  get itemSchema() {
    return itemSchema;
  }

  get userSchema() {
    return userSchema;
  }

  get ratingSchema() {
    return ratingSchema;
  }

  // dumb? dc
  removeId<T>(data: T): T {
    if (Array.isArray(data)) {
      return data?.map(({ _id, ...props }) => props) as any;
    } else {
      const { _id, ...props } = data as any;
      return props;
    }
  }
}

export const db = new Db();
export default db;
