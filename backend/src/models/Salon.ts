import mongoose, { Schema, Document } from 'mongoose';
import { ISalon } from '../types';

interface ISalonDocument extends ISalon, Document {}

const salonSchema = new Schema<ISalonDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  images: [{ type: String }],
  workingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: false } }
  },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<ISalonDocument>('Salon', salonSchema);