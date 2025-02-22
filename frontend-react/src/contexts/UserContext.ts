import { createContext } from 'react';
import { UserWithoutPassword } from '@/types/user.type.ts';

export const UserContext = createContext<UserWithoutPassword | undefined>(
  undefined,
);
