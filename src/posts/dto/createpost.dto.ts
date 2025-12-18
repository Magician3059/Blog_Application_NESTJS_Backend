import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Blog Post',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'This is the main content of the post.',
  })
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Category ID of the post',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

// import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

// export class CreatePostDto {
//   @IsNotEmpty() title: string;
//   @IsNotEmpty() content: string;
//   @IsOptional() @IsNumber() categoryId?: number;
// }
