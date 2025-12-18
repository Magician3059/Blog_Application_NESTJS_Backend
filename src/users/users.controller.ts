import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  // Protects the route with the JWT authentication strategy.
  // Only requests with a valid JWT token will be allowed.
  // JWT token is usually sent in the header:  Authorization: Bearer <token>
  @ApiBearerAuth('access-token')

  // @UseGuards(AuthGuard('jwt')) : Using Global Level AuthGuard
  @Get('profile')
  profile(@Req() req) {
    // req is the request object from Express (NestJS uses Express under the hood).
    return req.user; // req.user is the object , validate() returned.
  }
}
