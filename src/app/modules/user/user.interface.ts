import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'normal' | 'superAdmin';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserDeleted: (email: string) => Promise<boolean>;
  isUserPasswordMatched: (email: string, password: string) => Promise<TUser>;
  isUserExist: (email: string) => Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
