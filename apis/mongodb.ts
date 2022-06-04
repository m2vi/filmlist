import flGuiS from '@models/flGuiS';
import itemSchema from '@models/itemSchema';
import ratingSchema from '@models/ratingSchema';
import userSchema from '@models/userSchema';
import mongoose from 'mongoose';

class MongoDb {
  async init() {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: 'smarthub',
      autoIndex: true,
    });

    if (mongoose.connection) {
      return mongoose.connection;
    }
  }

  get flGuiS() {
    return flGuiS;
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

  removeId<T>(data: T): T {
    if (typeof data === 'undefined') {
      return data;
    } else if (Array.isArray(data)) {
      return data.map(({ _id, ...props }) => props) as any;
    } else {
      const { _id, ...props } = data as any;

      return props;
    }
  }
}

export const mongodb = new MongoDb();
export default mongodb;
