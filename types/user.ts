import { DiscordUser } from './oauth';

export interface UserRatings {
  identifier: string;
  author: string;
  filter: {
    id_db: number;
    type: number;
  };
  rating: number;
}

export interface UserProps {
  token: string;
  identifier: string;

  items: Array<UserItem>;
  notifications: Array<Notification>;

  created_at: number;
}

export interface UserItem {
  filter: FilterProps;
  index: number;
  state: number | null;
  rating: number | null;
}

export interface FilterProps {
  id: number;
  type: number;
  imdb_id?: string;
}

export interface JwtPayload {
  jti: string;
  iat: number;
}

export interface UserCookie extends DiscordUser {
  identifier: string;
  token: string;
  created_at: number;

  sessionId: string;
}
