import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(4, 20)
  @IsString()
  username: string;

  @Length(8, 32)
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `password is not strong`,
  })
  password: string;
}
