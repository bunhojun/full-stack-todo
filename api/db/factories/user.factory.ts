import { setSeederFactory } from 'typeorm-extension';
import { User } from '@/users/entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  const { fn, ln } = {
    fn: faker.person.firstName(),
    ln: faker.person.lastName(),
  };
  user.password = faker.internet.password();
  user.name = fn + ' ' + ln;
  user.email = faker.internet.email({
    firstName: fn,
    lastName: ln,
    provider: 'example.test.jp',
  });
  return user;
});
