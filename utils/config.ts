import { validateEnv } from './utils';

export const oauth = {
  cookieName: 'token',
  clientId: validateEnv('DISCORD_CLIENT_ID'),
  clientSecret: validateEnv('DISCORD_CLIENT_SECRET'),
  appUri: validateEnv('APP_URI', 'http://localhost:3000', true),
  jwtSecret: validateEnv('JWT_SECRET', 'bird is the word', true),
  allowedIDs: validateEnv('ALLOWED_IDS', '', true).split(','),
} as const;
