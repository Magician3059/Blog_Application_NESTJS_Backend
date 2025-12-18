// import type { RedisCache } from 'cache-manager-ioredis-yet';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './category/category.module';

import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { Category } from './category/entities/category.entity';
import { Comment } from './comments/comment.entity';

import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './redis.module';
import { JwtAuthGuard } from './common/auth.guard';
import { PermissionsGuard } from './permissions/permissions.guard';
import { PermissionsModule } from './permissions/permissions.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    // ConfigModule :  Load .env values so DB credentials are not hard-coded
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // isGlobal: true means we don’t need to import ConfigModule in every module again

    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    //  Database Connection (TypeORM)
    // Create a DB connection
    TypeOrmModule.forRoot({
      type: 'postgres', // Tells TypeORM which database to use (PostgreSQL)
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Post, Category, Comment], // Credentials to connect to DB
      synchronize: true, // Auto-create database tables based on entities (development only)
    }),

    // Register modules so their controllers/services become available to the application
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    CategoriesModule,
    RedisModule,
    PermissionsModule,
  ],
  // controllers: [AppController],
  providers: [
    // AuthGuard globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //  AuthGuard('jwt'),: // AuthGuard that respects @Public()
    },
    // PermissionsGuard globally
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
