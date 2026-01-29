import mongoose, { Schema, Document } from 'mongoose';
import { generatePaymentId } from '../utils/uuid';

export interface IPayment {
  paymentId: string;
  booking: any;
  customer: any;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentGateway: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IPaymentDocument extends IPayment, Document {}

const paymentSchema = new Schema<IPaymentDocument>({
  paymentId: { type: String, unique: true, default: generatePaymentId },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { type: String, enum: ['card', 'mobile_money', 'bank_transfer'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String },
  paymentGateway: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IPaymentDocument>('Payment', paymentSchema);