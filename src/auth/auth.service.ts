import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  //  Injects UsersService and JwtService so we can use them inside the class
  constructor(
    private userService: UsersService,
    private jwtSevice: JwtService,
  ) {}

  // ----------------------- Login -----------------------
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials'); // Wrong Passoword

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtSevice.sign(payload) };
  }

  // async register(registerDto : RegisterDto){

  //     // 1. Check if user already exists with this email
  //         const existing = await this.userService.findByEmail(registerDto.email);

  //         if (existing) throw new UnauthorizedException("Email already registered");

  //         // 2. Hash the password before saving
  //         const hashedpassword = await bcrypt.hash(registerDto.password, "Added salt to password");

  //         // 3. Save new user to database, replacing plain password with hashed one
  //         const user = await this.userService.create({ ...registerDto, password: hashedpassword });

  //         // 4. Remove password from returned object
  //         const { password, ...resp } = user;

  //         // 5. Return user data without password
  //         return resp; // exclude password
  //     }

  // ----------------------- Register -----------------------
  async register(registerDto: RegisterDto) {
    // 1. Check if user exists
    const existing = await this.userService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10); // password + salt

    // 3. Create user
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // 4. Remove password from response
    const { password, ...resp } = user;
    return resp;
  }
}
