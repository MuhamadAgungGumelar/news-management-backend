export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

export const VALID_ROLES = Object.values(AdminRole);
