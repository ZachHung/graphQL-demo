import { mock } from 'jest-mock-extended';
import { mockClear, MockProxy } from 'jest-mock-extended/lib/Mock';
import LOCATOR from '../../../core/container/types.container';
import { createTestingModule } from '../../../utils/test/create-testing-module';
import { CreatePostInput } from '../post.input';
import { PostModule } from '../post.module';
import { PostResolver } from '../post.resolver';
import { PostService } from '../post.service';
import { faker } from '@faker-js/faker';
import { RequiredContext } from '../../../core/types/context.interface';
import { Role } from '../../../core/types/role.enum';

describe('PostResolver', () => {
  let mockedPostService: MockProxy<PostService>;
  let mockedContext: MockProxy<RequiredContext>;
  let sut: PostResolver;

  beforeEach(async () => {
    // Bind test container
    const moduleRef = createTestingModule(PostModule);
    moduleRef.rebind(LOCATOR.Services.Post).toConstantValue(mockedPostService);
    sut = moduleRef.get(PostResolver);

    mockedPostService = mock<PostService>();
    mockedContext = mock<RequiredContext>();
  });

  test('should be define', () => {
    expect(sut).toBeDefined();
  });

  describe('createOne()', () => {
    // Arrange
    it('should create a new user', async () => {
      const createPostDTO: CreatePostInput = {
        content: faker.lorem.paragraph(5),
        title: faker.lorem.sentence(),
      };
      mockedContext.user.mockReturnValue({
        id: faker.datatype.uuid,
        role: Role.USER,
      });

      // Act
      const result = await sut.createPost(createPostDTO, mockedContext);
      console.log()

      // Assert
      expect(result).toBeDefined();
    });
  });
});
