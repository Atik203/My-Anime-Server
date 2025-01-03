import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import config from '../../config';
import AppError from '../../Errors/AppError';
import { TUser, UserModel } from './user.interface';

export const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      select: 0,
    },
    email: {
      type: String,
      unique: true,
    },

    role: {
      type: String,
      enum: ['admin', 'normal', 'superAdmin'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this as TUser;
  user.password = await bcrypt.hashSync(
    user.password,
    Number(config.bcrypt_salt),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserDeleted = async function (email: string) {
  const user = await this.findOne({ email });
  return user?.isDeleted;
};

userSchema.statics.isUserPasswordMatched = async function (
  email: string,
  password: string,
) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  return user;
};

userSchema.statics.isUserExist = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

export const User = model<TUser, UserModel>('User', userSchema);
