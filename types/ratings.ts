export interface UserRatings {
  identifier: string;
  author: string;
  filter: {
    id_db: number;
    type: number;
  };
  rating: number;
}
