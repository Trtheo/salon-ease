import mongoose, { Schema, Document } from 'mongoose';
import { IBooking } from '../types';
import { generateBookingId } from '../utils/uuid';

interface IBookingDocument extends IBooking, Document {}

const bookingSchema = new Schema<IBookingDocument>({
  bookingId: { type: String, unique: true, default: generateBookingId },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  salon: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IBookingDocument>('Booking', bookingSchema);