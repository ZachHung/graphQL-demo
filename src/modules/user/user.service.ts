import { AppDataSource } from '../../config/data-source';
import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { getEnv } from '../../utils/get-env';
import { UserTokens } from './user.types';
import jwt from 'jsonwebtoken';
import { typeReturn } from '../../utils/return-type';
import { GraphQLError } from 'graphql';

dotenv.config();

export const register = async (input: RegisterInput): Promise<User> => {
  let { password } = input;
  password = await bcrypt.hash(password, +getEnv('SALT_ROUND'));
  const userRepo = AppDataSource.getRepository(User);
  const newUser = userRepo.create({ ...input, password });
  await userRepo.save(newUser);
  return newUser;
};

export const login = async (input: LoginInput): Promise<UserTokens> => {
  const { password, usernameOrEmail } = input;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy([
    { username: usernameOrEmail },
    { email: usernameOrEmail },
  ]);

  if (!user) throw new GraphQLError('Invalid credentials');
  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) throw new GraphQLError('Invalid credentials');

  const { password: pass, refreshToken: refToken, ...serializeUser } = user;

  const accessToken = jwt.sign({ ...serializeUser }, getEnv('SECRET_JWT'), {
    expiresIn: getEnv('JWT_EXPIRED'),
  });
  const refreshToken = jwt.sign({ ...serializeUser }, getEnv('SECRET_REFRESH'), {
    expiresIn: getEnv('REFRESH_EXPIRED'),
  });

  user.refreshToken = refreshToken;
  await userRepo.save(user);
  return {
    accessToken,
    refreshToken,
  };
};

export const getAllUser = async (): Promise<User[]> => {
  const userRepo = AppDataSource.getRepository(User);
  const userList = await userRepo.find();
  return userList;
};

export const editInfo = async (input: EditInfoInput, userId: string): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);
  const update = await typeReturn<User>(
    // User query builder because of issue https://github.com/typeorm/typeorm/issues/2415
    userRepo
      .createQueryBuilder()
      .update(User)
      .set({ ...input })
      .where('id = :id ', {
        id: userId,
      })
      .returning('*')
      .execute(),
  );
  return update;
};

export const changePassword = async (input: ChangePasswordInput, userId: string): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: userId });
  // Check password hash
  if (!user) throw new GraphQLError('Invalid credentials');
  const isValidPass = await bcrypt.compare(input.oldPassword, user.password);
  if (!isValidPass) throw new GraphQLError('Invalid credentials');

  const newPassword = await bcrypt.hash(input.newPassword, +getEnv('SALT_ROUND'));
  return await typeReturn<User>(
    userRepo
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword })
      .where('id = :id ', {
        id: userId,
      })
      .returning('*')
      .execute(),
  );
};
