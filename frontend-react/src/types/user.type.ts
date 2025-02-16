export const UserRole = {
  normal: 'normal',
  admin: 'admin',
} as const;
export type UserRole = keyof typeof UserRole;

export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithoutPassword = Omit<User, 'password'>;
