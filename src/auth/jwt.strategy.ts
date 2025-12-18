import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// PassportStrategy is a wrapper class provided by NestJS to integrate Passport (authentication middleware)
// Strategy = Passport’s JWT authentication strategy.
// ExtractJwt = helper that knows how to extract token from request.

@Injectable() // @Injectable() marks this class as a provider so that NestJS Dependency Injection can manage it.
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Use JWT for authentication.

  //---------------------------------------------------------------------------------------------------------------------------
  // When a request comes with Authorization header like:  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cC...

  constructor(private readonly configService: ConfigService) {
    console.log('JwtStrategy initialized');
    // inject dependancy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extracts the token automatically.
      // secretOrKey: process.env.JWT_SECRET, // secretOrKey is used to verify that the token was signed by the server.
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // @UseGuards(AuthGuard('jwt')) hooks into the Passport strategy by name ('jwt').
  // If guard succeeds: the request object is decorated as req.user = <value returned by validate()>.
  // If it fails: Nest returns 401 before the controller method runs.

  validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
