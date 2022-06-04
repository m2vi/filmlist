import { SimpleObject } from '@Types/common';
import { Hoster, User } from '@Types/rd';
import { basicFetch } from 'helper/fetch';
import QueryString from 'qs';

class RealDebrid {
  private get api_key(): string | undefined {
    return process.env.REAL_DEBRID_KEY;
  }

  private get _hoster(): string[] {
    return ['1f', 'ddl', 'fstc', 'gd', 'mega', 'mf', 'nf', 'rg', 'sc', 'tb', 'ulto', 'voe'];
  }

  public async hoster(): Promise<Hoster[]> {
    const data = await basicFetch<SimpleObject<Hoster>>(
      `https://api.real-debrid.com/rest/1.0/hosts/status?${QueryString.stringify({ auth_token: this.api_key })}`
    );

    let arr: Hoster[] = [];

    for (const key in data) {
      const el = data[key];

      if (!el.supported) continue;

      if (this._hoster.includes(el?.id)) {
        arr.push(el);
      }
    }

    return arr;
  }

  public async user(): Promise<User> {
    const data = await basicFetch<User>(`https://api.real-debrid.com/rest/1.0/user?${QueryString.stringify({ auth_token: this.api_key })}`);

    return data;
  }
}

export const realdebrid = new RealDebrid();
export default realdebrid;
