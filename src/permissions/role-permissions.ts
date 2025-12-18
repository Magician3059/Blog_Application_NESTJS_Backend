import { UserRole } from '../users/user.entity';
import { Permission } from '../permissions/permissions.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.POST_CREATE,
    Permission.POST_UPDATE,
    Permission.POST_DELETE,

    Permission.COMMENT_CREATE,
    Permission.COMMENT_UPDATE,
    Permission.COMMENT_DELETE,
  ],

  [UserRole.ADMIN]: [
    ...Object.values(Permission), // ADMIN can do everything
  ],
};
