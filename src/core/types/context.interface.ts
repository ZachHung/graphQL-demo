import { Request } from 'express';
import { User } from '../../modules/user/user.entity';

export type Context = {
  req: Request;
  user?: User;
};

export type RequiredContext = Required<Context>;
