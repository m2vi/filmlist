import historySchema from '@models/historySchema';
import userSchema from '@models/userSchema';
import { connectToDatabase } from '@utils/database';
import { UserInterface } from '@utils/types';
import moment from 'moment';
import { Connection, Model } from 'mongoose';
import { stringify } from 'querystring';

class User {
  schema: Model<UserInterface, {}, {}, {}>;

  constructor() {
    this.schema = userSchema;
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

  public async saveHistory(id: string) {
    await this.init();

    const doc = new historySchema({ client: id, sessionStart: moment().format('DD[.]MM[.]YYYY HH:mm'), time: Date.now() });

    return await doc.save();
  }
}

export const user = new User();
export default user;
