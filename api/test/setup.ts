import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import GenesisSeeder from '../db/seeds/0_genesis.seed';

export const buildTestDataSource = async (configService: ConfigService) => {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: ['src/**/entities/*.entity.ts'],
    logging: false,
    // for test-db settings from here
    synchronize: true,
    dropSchema: true,
  };
  return new DataSource(options);
};

export const seederOptions: SeederOptions = {
  seeds: [GenesisSeeder], // every test has to run GenesisSeeder. add other seeders on a per-test basis
  factories: ['db/factories/**/*{.ts,.js}'],
};
