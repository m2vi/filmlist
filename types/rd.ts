export interface User {
  id: number;
  username: string;
  email: string;
  points: number; // Fidelity points
  locale: string; // User language
  avatar: string; // URL
  type: string; // "premium" or "free"
  premium: number; // seconds left as a Premium user
  expiration: string; // jsonDate
}

export interface Hoster {
  id: string;
  name: string;
  image: string; // URL
  supported: 0 | 1; // 0 or 1
  status: 'up' | 'down' | 'unsupported'; // "up" / "down" / "unsupported"
  check_time: string; // jsonDate
  competitors_status?: {
    [domain: string]: {
      // Competitor domain
      status: 'up' | 'down' | 'unsupported'; // "up" / "down" / "unsupported"
      check_time: string; // jsonDate
    };
  };
}
