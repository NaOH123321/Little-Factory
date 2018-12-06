import { User, Err } from ".";

export interface Auth {
  user?: User;
  userId?: string;
  token?: string;
  err?: Err;
}
