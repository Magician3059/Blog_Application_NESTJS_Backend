import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RolesGuard } from '../common/roles.guard';
import { PermissionsCacheService } from '../permissions/permissions-cache.service';

@Module({
  controllers: [PermissionsController],
  providers: [
    PermissionsService,
    PermissionsGuard,
    RolesGuard,
    PermissionsCacheService,
  ],
  exports: [PermissionsGuard, RolesGuard, PermissionsCacheService],
})
export class PermissionsModule {}
