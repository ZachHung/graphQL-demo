import { AuthCheckerInterface, ResolverData } from 'type-graphql';
import { Context } from './types/context.interface';
import jwt from 'jsonwebtoken';
import { getEnv } from '../utils/get-env';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../config/data-source';
import { User } from '../modules/user/user.entity';

dotenv.config();

export class CustomAuthChecker implements AuthCheckerInterface<Context> {
  async check({ context }: ResolverData<Context>, roles: string[]): Promise<boolean> {
    try {
      const authorization = context.req.headers.authorization;
      if (!authorization) return false;
      const [schema, token] = authorization.split(' ');
      if (schema !== 'Bearer') return false;
      const payload = jwt.verify(token, getEnv('SECRET_JWT')) as User;
      //
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { id: payload.id } });
      if (!user) return false;

      if (!roles.includes(user.role) && roles.length !== 0) return false;

      context.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
