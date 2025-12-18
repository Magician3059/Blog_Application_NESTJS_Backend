import { Expose } from 'class-transformer';

export class ResponsePostDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  categoryId?: number;

  @Expose()
  attachments?: string[];
}
