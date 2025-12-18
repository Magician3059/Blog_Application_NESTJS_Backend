export enum Permission {
  POST_CREATE = 'post:create',
  POST_UPDATE = 'post:update',
  POST_DELETE = 'post:delete',

  COMMENT_CREATE = 'comment:create',
  COMMENT_UPDATE = 'comment:update',
  COMMENT_DELETE = 'comment:delete',

  CATEGORY_CREATE = 'category:create',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',

  USER_READ = 'user:read',
  USER_MAKE_ADMIN = 'user:make-admin',
}
