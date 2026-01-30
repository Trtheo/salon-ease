import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  salon: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  images: {
    before?: string;
    after: string;
    caption?: string;
  }[];
  services: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>({
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    before: String,
    after: { type: String, required: true },
    caption: String
  }],
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

portfolioSchema.index({ salon: 1, category: 1 });

export default mongoose.model<IPortfolio>('Portfolio', portfolioSchema);