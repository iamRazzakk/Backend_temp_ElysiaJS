import { Document } from 'mongoose';
import { USER_ENUM } from '../../enum/user.enum';

interface IAuthenticationProps {
  isResetPassword: boolean;
  oneTimeCode: number;
  expireAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  contact: string;
  role: USER_ENUM;
  isBanned?: boolean;
  isDeleted?: boolean;
  loginAttempts?: number;
  lastLogin?: Date;
  authentication?: IAuthenticationProps;
  createdAt: Date;
  updatedAt: Date;
}
