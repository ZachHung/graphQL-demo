import { injectable as Injectable, inject as Inject } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import TOKEN from '../../core/container/types.container';
import BaseRepository from '../../core/types/repository.interface';
import { Post } from './post.entity';

@Injectable()
export class PostRepository extends Repository<Post> implements BaseRepository<Post> {
  constructor(@Inject(TOKEN.DataSource.Posgres) appDataSource: DataSource) {
    super(Post, appDataSource.createEntityManager());
  }

  async findOneWhere(column: string, value: string | number, operator = '='): Promise<Post | null> {
    return await this.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where(`post.${column} ${operator} :value`, { value })
      .getOne();
  }
}
