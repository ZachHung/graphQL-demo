import { ContainerModule } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { PostRepository } from './post.repository';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

export class PostModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind<PostService>(TOKEN.Services.Post).to(PostService);
      bind<PostResolver>(PostResolver).toSelf();
      bind<PostRepository>(TOKEN.Repositories.Post).to(PostRepository);
    });
  }
}
