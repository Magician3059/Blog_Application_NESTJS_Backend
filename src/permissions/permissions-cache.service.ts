import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ROLE_PERMISSIONS } from './role-permissions';

@Injectable()
export class PermissionsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private cacheKey(role: string) {
    return `role:${role}:permissions`;
  }

  async getPermissions(role: string): Promise<string[]> {
    const key = this.cacheKey(role);

    // 1️⃣ Redis first
    const cached = await this.cache.get<string[]>(key);
    if (cached) return cached;

    // 2️⃣ Fallback (static / DB)
    const permissions = ROLE_PERMISSIONS[role] || [];

    // 3️⃣ Cache with TTL (1 hour)
    await this.cache.set(key, permissions, 60 * 60);

    return permissions;
  }

  async invalidate(role: string) {
    await this.cache.del(this.cacheKey(role));
  }
}
