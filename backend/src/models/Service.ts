import mongoose, { Schema, Document } from 'mongoose';
import { IService } from '../types';

interface IServiceDocument extends IService, Document {}

const serviceSchema = new Schema<IServiceDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  salon: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IServiceDocument>('Service', serviceSchema);