import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-User.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>, private jwtService:JwtService) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { username, password } = createUserDto;

    //hashing the password, with the args password and number of salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({ username, password: hashedPassword });

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

  async signIn(loginCredentials: CreateUserDto): Promise<{ accessToken }> {
    const { username, password } = loginCredentials;
    const user = await this.usersRepo.findOne({
      where: { username: username },
    });

    //creating a access token upon login
    const payload:Payload = { username }
    const accessToken: string = this.jwtService.sign(payload)

    if (user && (await bcrypt.compare(password, user.password))) {
      return {accessToken}
    } else {
      throw new UnauthorizedException(`Please check your login credentials`);
    }
  }
}
