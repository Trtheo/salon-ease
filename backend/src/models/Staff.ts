import mongoose, { Document, Schema } from 'mongoose';

export interface IStaff extends Document {
  salon: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  position: string;
  specialties: string[];
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  services: mongoose.Types.ObjectId[];
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>({
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  avatar: String,
  position: {
    type: String,
    required: true
  },
  specialties: [String],
  workingHours: {
    monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    saturday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
    sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  hireDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

staffSchema.index({ salon: 1, isActive: 1 });

export default mongoose.model<IStaff>('Staff', staffSchema);