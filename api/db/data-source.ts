import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();
const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};
export const AppDataSource = new DataSource(options);
