import { Mutation, Resolver, Arg, Query, Authorized, Ctx } from 'type-graphql';
import { Context } from '../../core/types/context.interface';

import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from './user.input';
import { User } from './user.entity';
import { UserTokens } from './user.types';
import { Role } from '../../core/types/role.enum';
import { UserService } from './user.service';
import { inject as Inject, injectable as Injectable } from 'inversify';
import LOCATOR from '../../core/container/types.container';

@Injectable()
@Resolver(() => User)
export class UserResolver {
  constructor(@Inject(LOCATOR.Services.User) private readonly userService: UserService) {}

  @Authorized()
  @Query((_type) => User)
  public async me(@Ctx() { user }: Required<Context>): Promise<User> {
    const response = await this.userService.findById(user.id);
    return response;
  }

  @Authorized(Role.ADMIN)
  @Query(() => [User])
  public async allUser(): Promise<User[]> {
    const response = await this.userService.getAllUser();
    return response;
  }

  @Mutation((_type) => User)
  public async register(@Arg('input') input: RegisterInput): Promise<User> {
    const response = await this.userService.register(input);
    return response;
  }

  @Mutation((_type) => UserTokens)
  public async login(@Arg('input') input: LoginInput): Promise<UserTokens> {
    const response = await this.userService.login(input);
    return response;
  }

  @Authorized()
  @Mutation((_type) => User)
  public async editInfoUser(
    @Arg('input') input: EditInfoInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<User> {
    const response = await this.userService.editInfo(input, user.id);
    return response;
  }

  @Authorized()
  @Mutation(() => User)
  public async changePasswordUser(
    @Arg('input') input: ChangePasswordInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<User> {
    const response = await this.userService.changePassword(input, user.id);
    return response;
  }
}
