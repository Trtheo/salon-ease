import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  }
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, salon: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', favoriteSchema);