import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const user = this.usersRepository.create(createUserDto as Partial<User>);
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneWithPassword(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'username', 'password', 'role', 'name'] // Explicitly select password
      // Alternatively use query builder to addSelect, but simple select works if we list all needed fields.
      // Better: use addSelect if we want all + password.
    });
  }
}
