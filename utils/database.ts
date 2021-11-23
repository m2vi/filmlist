import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI!, {
    dbName: 'smarthub',
    autoIndex: true,
  });

  if (mongoose.connection) {
    return mongoose.connection;
  }
};
