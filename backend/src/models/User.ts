import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';
import { generateUserId } from '../utils/uuid';

interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  userId: { type: String, unique: true, default: generateUserId },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'salon_owner', 'admin'], default: 'customer' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  notificationSettings: {
    emailBookings: { type: Boolean, default: true },
    emailPromotions: { type: Boolean, default: false },
    smsReminders: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true }
  },
  socialAuth: {
    google: {
      uid: String,
      email: String,
      name: String,
      photoURL: String
    },
    facebook: {
      uid: String,
      email: String,
      name: String,
      photoURL: String
    },
    twitter: {
      uid: String,
      email: String,
      name: String,
      photoURL: String
    }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password!, 12);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUserDocument>('User', userSchema);