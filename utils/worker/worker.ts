import { NextApiRequest } from 'next';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { NextRequest } from 'next/server';
import { JwtPayload } from '../types';

class Api {
  async verify(req: NextApiRequest | NextRequest) {
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

    return [jwt.decode(token) as JwtPayload, null];
  }
}

export const api = new Api();
export default api;
