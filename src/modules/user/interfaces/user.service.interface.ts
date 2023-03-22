import { User } from '../user.entity';
import { ChangePasswordInput, EditInfoInput, LoginInput, RegisterInput } from '../user.input';
import { UserTokens } from '../user.types';

export default interface UserServiceI {
  findById: (id: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  login: (input: LoginInput) => Promise<UserTokens>;
  changePassword: (input: ChangePasswordInput, id: string) => Promise<User>;
  getAllUser: () => Promise<User[]>;
  editInfo: (input: EditInfoInput, id: string) => Promise<User>;
}
