import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // Nest injects repository)
  ) {}

  // ------------------------------------------------------------------------------------------------------------------------

  async findAll() {
    return this.userRepo.find();
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } }); // find user by email in where clause :  where email = ?
  }

  async create(data: Partial<User>) {
    // Patial<T> : It makes all properties of type T optional

    const user = this.userRepo.create(data); // create new user

    return await this.userRepo.save(user); // save user to db
  }

  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async makeAdmin(id: number) {
    const user = await this.findById(id);
    if (!user) return null;
    user.role = UserRole.ADMIN;
    return this.userRepo.save(user);
  }
}
