import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return this.findOneUser(newUser.id);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOneUser(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findOneByEmailForAuth(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['password', 'id'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOneUser(id);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
