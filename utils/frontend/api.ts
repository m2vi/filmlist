import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import { DiscordUser } from '@utils/types';
import { ParsedUrlQuery } from 'querystring';

class Jwt {
  decode() {
    const cookie = cookies.get('token');
    if (!cookie) return false;
    return jwt.decode(cookie) as DiscordUser;
  }
}

export class Api {
  jwt: Jwt;
  constructor() {
    this.jwt = new Jwt();
  }

  async fetchMoreData(query: ParsedUrlQuery, locale: string | undefined, start: number) {
    try {
      const res = await (
        await fetch(
          `/api/manage/tab?tab=${query.tab ? query.tab : 'none'}&locale=${locale}&start=${start}&end=${start + 75}${
            query.id ? `&includeGenres=${query.id}` : ''
          }`
        )
      ).json();

      return res.items ? res.items : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export const api = new Api();

export default api;
