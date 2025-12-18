import { Expose } from 'class-transformer';

export class ResponseCategoryDto {
  @Expose()
  name: string;

  @Expose()
  description?: string;
}
