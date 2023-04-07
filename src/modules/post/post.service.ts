import { GraphQLError } from 'graphql';
import { typeReturn } from '../../utils/return-type';
import { Post } from './post.entity';
import { CreatePostInput, EditPostInput } from './post.input';
import { inject as Inject, injectable as Injectable } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { PostRepository } from './post.repository';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(@Inject(TOKEN.Repositories.Post) private readonly postRepository: PostRepository) {}
  async findById(id: string): Promise<Post | null> {
    try {
      const post = await this.postRepository.findOneWhere('id', id);
      return post;
    } catch (error) {
      return null;
    }
  }

  async create(input: CreatePostInput, userId: string): Promise<Post> {
    const post = this.postRepository.create({ ...input, userId });
    await this.postRepository.save(post);
    post.user = (await this.postRepository
      .createQueryBuilder()
      .relation(Post, 'user')
      .of(post)
      .loadOne()) as User;
    return post;
  }

  async edit(input: EditPostInput, userId: string): Promise<Post> {
    const post = await this.postRepository.findOneWhere('id', input.id);

    if (!post || post.userId !== userId)
      throw new GraphQLError("You don't have the right to do that");
    const update = await typeReturn<Post>(
      this.postRepository
        .createQueryBuilder('post')
        .update(Post)
        .set({ ...input })
        .where('id = :id ', {
          id: input.id,
        })
        .returning('*')
        .execute(),
    );
    return update;
  }
}
