import { DiscordUser } from './discord';

export interface JwtPayload {
  jti: string;
  iat: number;
}

export interface FilterProps {
  id: number;
  type: number;
  imdb_id?: string;
}

export interface UserItem {
  filter: FilterProps;
  index: number;
  state: number | null;
  rating: number | null;
}

export interface UserProps {
  token: string;
  identifier: string;

  items: Array<UserItem>;
  history: Array<HistoryItem>;
  notifications: Array<Notification>;

  created_at: number;
}

export interface HistoryItem {
  client_id: string;

  client_ip: string | null;
  client_ua: string | null;
  client_lang: string | null;

  sessionId: string;
  sessionStart: number;
}

export interface Notification {
  identifier: string;
  status: 'read' | 'unread'; //? 'unread' does not make sense lol
}

export interface UserCookie extends DiscordUser {
  identifier: string;
  token: string;
  created_at: number;

  sessionId: string;
}
