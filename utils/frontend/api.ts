import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import { DiscordUser } from '@utils/types';

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
}

export const api = new Api();

export default api;
