import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { getEnv } from '../utils/get-env';
import { join } from 'path';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: getEnv('POSTGRES_HOST'),
  port: +getEnv('POSTGRES_PORT'),
  username: getEnv('POSTGRES_USER'),
  password: getEnv('POSTGRES_PASS'),
  database: getEnv('POSTGRES_DB'),
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '..', '/modules/**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', '/migration/*.{js,ts}')],
  subscribers: [],
});
