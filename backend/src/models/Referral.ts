import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referred: mongoose.Types.ObjectId;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  reward: {
    amount: number;
    type: 'discount' | 'credit';
    claimed: boolean;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  reward: {
    amount: { type: Number, default: 10 },
    type: { type: String, enum: ['discount', 'credit'], default: 'discount' },
    claimed: { type: Boolean, default: false }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

referralSchema.index({ code: 1 });
referralSchema.index({ referrer: 1 });

export default mongoose.model<IReferral>('Referral', referralSchema);