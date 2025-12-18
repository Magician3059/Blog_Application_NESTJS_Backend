import { SetMetadata } from '@nestjs/common';
// import { Role } from './role.enum';
import { UserRole } from 'src/users/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
