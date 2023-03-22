import { inject as Inject, injectable as Injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import LOCATOR from '../../core/container/types.container';
import BaseRepository from '../../core/types/repository.interface';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> implements BaseRepository<User> {
  constructor(@Inject(LOCATOR.DataSource.Posgres) appDataSource: DataSource) {
    super(User, appDataSource.createEntityManager());
  }
  async findOneWhere(column: string, value: string | number, operator = '='): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where(`user.${column} ${operator} :value`, { value })
      .getOne();
  }
}
