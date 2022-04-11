import { UserCookie } from '@Types/user';
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import QueryString from 'qs';

export class UserClient {
  getUser(): UserCookie | null {
    const token = cookie.get('token');
    if (!token) return null;
    return jwt.decode(token) as any;
  }

  get id(): string | null {
    const user = this.getUser();

    return user?.id ? user?.id : null;
  }

  getAvatarUrl(size: string | number = 256): string {
    const user = this.getUser();

    return `https://cdn.discordapp.com/avatars/${user?.identifier}/${user?.avatar}?${QueryString.stringify({ size })}`;
  }
}

export const userClient = new UserClient();
export default userClient;
