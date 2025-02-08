import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';

export default class GenesisSeeder implements Seeder {
  public async run(
    _dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    await userFactory.save({
      email: 'test@test.example.com',
      password: 'password!',
      name: 'Jane Doe',
    });
    await userFactory.save({
      email: 'test2@test.example.com',
      password: 'password!',
      name: 'John Doe',
    });
  }
}
