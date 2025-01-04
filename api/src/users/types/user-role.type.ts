export const UserRole = {
  normal: 'normal',
  admin: 'admin',
} as const;
export type UserRole = keyof typeof UserRole;
