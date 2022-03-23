import userSchema from '@models/userSchema';
import history, { History } from '@utils/backend/history';
import { connectToDatabase } from '@utils/database';
import { UserInterface } from '@utils/types';
import { Connection, Model } from 'mongoose';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

class User {
  schema: Model<UserInterface, {}, {}, {}>;
  history: History;

  constructor() {
    this.schema = userSchema;
    this.history = history;
  }

  private async init(): Promise<Connection | undefined> {
    const connection = await connectToDatabase();

    return connection;
  }

  public async find(id: string) {
    await this.init();

    const item = await this.schema.findOne({ id: id.toString() }).lean();

    return item;
  }

  public id(req: NextApiRequest) {
    //? ik, don't bully me
    return '701400631662870609';
  }
}

export const user = new User();
export default user;
