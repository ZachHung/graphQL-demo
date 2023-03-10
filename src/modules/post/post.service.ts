import { GraphQLError } from 'graphql';
import { AppDataSource } from '../../config/data-source';
import { typeReturn } from '../../utils/return-type';
import { User } from '../user/user.entity';
import { Post } from './post.entity';
import { CreatePostInput, EditPostInput } from './post.input';

export const findById = async (id: string): Promise<Post | null> => {
  try {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({ where: { id }, relations: { user: true } });
    return post;
  } catch (error) {
    return null;
  }
};

export const create = async (input: CreatePostInput, user: User): Promise<Post> => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = postRepo.create({ ...input, user });
  await postRepo.save(post);
  return post;
};

export const edit = async (input: EditPostInput, user: User): Promise<Post> => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: input.id } });

  if (!post || post.userId !== user.id)
    throw new GraphQLError("You don't have the right to do that");
  const update = await typeReturn<Post>(
    postRepo
      .createQueryBuilder('post')
      .update(Post)
      .set({ ...input })
      .where('id = :id ', {
        id: input.id,
      })
      .returning('*')
      .execute(),
  );
  update.user = user;
  return update;
};
