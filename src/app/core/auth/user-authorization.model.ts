import { User } from './user.model';

export interface UserAuthorization {
  user: User;
  expired: boolean;
}
