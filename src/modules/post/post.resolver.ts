import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context } from '../../core/types/context.interface';
import { Post } from './post.entity';
import { CreatePostInput, EditPostInput } from './post.input';
import * as PostService from './post.service';

@Resolver()
export class PostResolver {
  @Query(() => Post, { nullable: true })
  async postById(@Arg('postId') postId: string): Promise<Post | null> {
    const response = await PostService.findById(postId);
    return response;
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<Post> {
    const response = await PostService.create(input, user);
    return response;
  }

  @Authorized()
  @Mutation(() => Post)
  async editPost(
    @Arg('input') input: EditPostInput,
    @Ctx() { user }: Required<Context>,
  ): Promise<Post> {
    const response = await PostService.edit(input, user);
    return response;
  }
}
