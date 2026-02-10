import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.interface';
import { USER_ENUM } from '../../enum/user.enum';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: Object.values(USER_ENUM),
      default: USER_ENUM.USER,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [16, 'Age must be at least 16'],
      max: [150, 'Age cannot exceed 150'],
    },
    contact: {
      type: String,
      required: [true, 'Contact is required'],
      role: {
        type: String,
        enum: Object.values(USER_ENUM),
        default: USER_ENUM.USER,
      },
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
    authentication: {
      isResetPassword: {
        type: Boolean,
        default: false,
      },
      oneTimeCode: {
        type: Number,
      },
      expireAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
);

userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  // Password comparison can be implemented later with bcrypt
  return password === hashPassword;
};

userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({ email: this.email! });
  if (isExist) {
    throw new Error('Email already exists');
  }
  // Password hashing can be implemented later with bcrypt
  next();
});

export const User = model<IUser>('User', userSchema);
