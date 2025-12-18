import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}

// import { IsEmail, IsNotEmpty } from 'class-validator';

// export class RegisterDto {
//   @IsNotEmpty()
//   name: string;

//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   password: string;
// }
