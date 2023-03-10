import { Mutation, Resolver, Arg, Query, Authorized, Ctx } from 'type-graphql';
import { Context } from '../../core/types/context.interface';

import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { User } from './user.entity';
import * as UserService from './user.service';
import { UserTokens } from './user.types';
import { Role } from '../../core/types/role.enum';

@Resolver()
export class UserResolver {
  @Authorized()
  @Query((_type) => User)
  public me(@Ctx() { user }: Required<Context>): User {
    return user;
  }

  @Authorized(Role.ADMIN)
  @Query(() => [User])
  public async allUser(): Promise<User[]> {
    const response = await UserService.getAllUser();
    return response;
  }

  @Mutation((_type) => User)
  public async register(@Arg('input') input: RegisterInput): Promise<User> {
    const response = await UserService.register(input);
    return response;
  }

  @Mutation((_type) => UserTokens)
  public async login(@Arg('input') input: LoginInput): Promise<UserTokens> {
    const response = await UserService.login(input);
    return response;
  }

  @Authorized()
  @Mutation((_type) => User)
  public async editInfoUser(
    @Arg('input') input: EditInfoInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<User> {
    const response = await UserService.editInfo(input, user.id);
    return response;
  }

  @Authorized()
  @Mutation(() => User)
  public async changePasswordUser(
    @Arg('input') input: ChangePasswordInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<User> {
    const response = await UserService.changePassword(input, user.id);
    return response;
  }
}
