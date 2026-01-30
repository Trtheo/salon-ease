import mongoose, { Document, Schema } from 'mongoose';

export interface IVideoCall extends Document {
  initiator: mongoose.Types.ObjectId;
  participant: mongoose.Types.ObjectId;
  roomId: string;
  status: 'pending' | 'active' | 'ended' | 'missed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  callType: 'consultation' | 'booking_discussion' | 'support';
  createdAt: Date;
  updatedAt: Date;
}

const videoCallSchema = new Schema<IVideoCall>({
  initiator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'ended', 'missed'],
    default: 'pending'
  },
  startTime: Date,
  endTime: Date,
  duration: Number,
  callType: {
    type: String,
    enum: ['consultation', 'booking_discussion', 'support'],
    default: 'consultation'
  }
}, {
  timestamps: true
});

videoCallSchema.index({ initiator: 1, createdAt: -1 });
videoCallSchema.index({ participant: 1, createdAt: -1 });

export default mongoose.model<IVideoCall>('VideoCall', videoCallSchema);