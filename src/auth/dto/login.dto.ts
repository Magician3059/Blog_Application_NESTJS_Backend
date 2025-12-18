import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}

// import { IsEmail, IsNotEmpty } from 'class-validator';

// export class LoginDto {
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   password: string;
// }
