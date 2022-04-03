import { NextApiRequest } from 'next';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { NextRequest } from 'next/server';
import { JwtPayload } from '@Types/user';

class Api {
  async verify(req: NextApiRequest | NextRequest, allowGuest: boolean = false) {
    const token = req.cookies.token || (req.headers as any).get('authorization');

    if (!token) {
      return [false, 'Not logged in'];
    }

    if (process.env.API_TOKEN && token === process.env.API_TOKEN) {
      return [true, null];
    }

    try {
      if (!(await jwt.verify(token, process.env.JWT_SECRET!))) {
        return [false, 'Invalid session'];
      }
    } catch (error) {
      return [false, (error as any).message];
    }

    const payload = jwt.decode(token) as any;

    if (!allowGuest && payload?.isGuest) {
    }

    return [jwt.decode(token) as JwtPayload, null];
  }
}

export const api = new Api();
export default api;
