import { ContainerModule } from 'inversify';
import TOKEN from '../../core/container/types.container';
import UserServiceI from './interfaces/user.service.interface';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

export class UserModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind<UserServiceI>(TOKEN.Services.User).to(UserService);
      bind<UserResolver>(UserResolver).toSelf();
      bind<UserRepository>(TOKEN.Repositories.User).to(UserRepository);
    });
  }
}
