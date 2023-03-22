import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { EventModule } from '../../modules/events/event.module';
import { PostModule } from '../../modules/post/post.module';
import { UserModule } from '../../modules/user/user.module';
import { CustomAuthChecker } from '../middlewares/auth-checker.middleware';
import { ErrorLoggerMiddleware } from '../middlewares/error-logger.middleware';
import LOCATOR from './types.container';

const container = new Container({ skipBaseClassChecks: true, defaultScope: 'Singleton' });

container.load(new UserModule(), new PostModule(), new EventModule());
container.bind<DataSource>(LOCATOR.DataSource.Posgres).toConstantValue(AppDataSource);

// Bind Middlewares
container.bind<CustomAuthChecker>(CustomAuthChecker).to(CustomAuthChecker).inSingletonScope();
container
  .bind<ErrorLoggerMiddleware>(ErrorLoggerMiddleware)
  .to(ErrorLoggerMiddleware)
  .inSingletonScope();

export default container;
