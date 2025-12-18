import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';
import { Category } from '../category/entities/category.entity';
import { RedisModule } from 'src/redis.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category]),
    UsersModule,
    RedisModule,

    // Queue name: post-attachments
    BullModule.registerQueue({
      name: 'post-attachments',
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
