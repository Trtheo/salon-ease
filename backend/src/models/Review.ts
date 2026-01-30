import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  customer: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  response?: {
    text: string;
    respondedAt: Date;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  images: [{
    type: String
  }],
  response: {
    text: String,
    respondedAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ salon: 1, createdAt: -1 });
reviewSchema.index({ customer: 1, salon: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);