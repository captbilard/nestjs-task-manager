import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-User.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { username, password } = createUserDto;
    const user = this.usersRepo.create({ username, password });

    try {
      await this.usersRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        //postgres duplicate error code
        throw new ConflictException('username already chosen');
      } else {
        throw new InternalServerErrorException();
      }
    }

    //return await this.usersRepo.save(user);
  }
}
