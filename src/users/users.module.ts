import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ Import TypeOrmModule
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'; // ✅ Import User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ Register User repository
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Optional: if other modules need UsersService
})
export class UsersModule {}
