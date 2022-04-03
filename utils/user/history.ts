import { HistoryItem, UserItem } from '@Types/user';
import db from '@utils/db/main';
import { getClientIp, Request } from 'request-ip';

export class History {
  private getBase(req: Request) {
    return {
      ip: getClientIp(req),
      ua: req.headers['user-agent'] ? req.headers['user-agent'] : null,
      lang: req.headers['accept-language'] ? req.headers['accept-language'] : null,
    };
  }

  private sessionId(client_id: string, sessionStart: number) {
    const id = Buffer.from(client_id, 'utf-8').toString('base64url');
    const timestamp = Buffer.from(sessionStart.toString(), 'utf-8').toString('base64url');

    return `${id}.${timestamp}`;
  }

  public get(client_id: string, req: Request): HistoryItem {
    const base = this.getBase(req);
    const sessionStart = Date.now();

    return {
      client_id: client_id,

      client_ip: base.ip,
      client_ua: base.ua,
      client_lang: base.lang,

      sessionId: this.sessionId(client_id, sessionStart),
      sessionStart: sessionStart,
    };
  }

  public async insert(client_id: string, req: Request): Promise<HistoryItem> {
    const item = this.get(client_id, req);

    await db.init();
    await db.userSchema.updateOne({ identifier: client_id }, { $push: { history: item } });

    return item;
  }

  //? if case
  public async saveItem(id: string, item: UserItem) {}
}

export const history = new History();
export default history;
