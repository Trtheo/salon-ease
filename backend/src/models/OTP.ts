import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP {
  phone?: string;
  email?: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt?: Date;
}

interface IOTPDocument extends IOTP, Document {}

const otpSchema = new Schema<IOTPDocument>({
  phone: { type: String },
  email: { type: String },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTPDocument>('OTP', otpSchema);