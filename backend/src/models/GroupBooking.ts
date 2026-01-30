import mongoose, { Document, Schema } from 'mongoose';

export interface IGroupBooking extends Document {
  organizer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  participants: {
    user: mongoose.Types.ObjectId;
    status: 'pending' | 'confirmed' | 'declined';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    amount: number;
  }[];
  maxParticipants: number;
  totalAmount: number;
  splitType: 'equal' | 'custom';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const groupBookingSchema = new Schema<IGroupBooking>({
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  participants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 10
  },
  totalAmount: {
    type: Number,
    required: true
  },
  splitType: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IGroupBooking>('GroupBooking', groupBookingSchema);