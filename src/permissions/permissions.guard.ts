import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../permissions/permissions.decorator';
// import { ROLE_PERMISSIONS } from './role-permissions';
import { UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../common/public.decorator';
import { PermissionsCacheService } from '../permissions/permissions-cache.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsCache: PermissionsCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException();

    // 🔥 Redis-powered permission fetch
    const userPermissions = await this.permissionsCache.getPermissions(
      user.role,
    );

    return requiredPermissions.every((p) => userPermissions.includes(p));
  }
}

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (isPublic) return true; // Skip guard for public routes

//     const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
//       PERMISSIONS_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     if (!requiredPermissions) return true;

//     const { user } = context.switchToHttp().getRequest();
//     if (!user) {
//       throw new UnauthorizedException('User not authenticated');
//     }

//     const userPermissions = ROLE_PERMISSIONS[user.role] || [];
//     return requiredPermissions.every((permission) =>
//       userPermissions.includes(permission),
//     );
//   }
// }
