import { Response } from 'express';
import VideoCall from '../models/VideoCall';
import { AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notificationService';

// Initiate video call
export const initiateCall = async (req: AuthRequest, res: Response) => {
  try {
    const { participantId, callType = 'consultation' } = req.body;
    const initiatorId = req.user!._id;

    // Generate unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const videoCall = await VideoCall.create({
      initiator: initiatorId,
      participant: participantId,
      roomId,
      callType
    });

    // Send notification to participant
    await createNotification({
      recipient: participantId,
      title: 'Incoming Video Call',
      message: `${req.user!.name} is calling you`,
      type: 'general',
      data: { callId: videoCall._id, roomId }
    });

    const populatedCall = await VideoCall.findById(videoCall._id)
      .populate('initiator', 'name avatar')
      .populate('participant', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedCall
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Join video call
export const joinCall = async (req: AuthRequest, res: Response) => {
  try {
    const { callId } = req.params;
    const userId = req.user!._id;

    const videoCall = await VideoCall.findById(callId);
    
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        error: 'Video call not found'
      });
    }

    // Check if user is participant
    if (!videoCall.participant.equals(userId) && !videoCall.initiator.equals(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to join this call'
      });
    }

    // Update call status
    if (videoCall.status === 'pending') {
      videoCall.status = 'active';
      videoCall.startTime = new Date();
      await videoCall.save();
    }

    res.json({
      success: true,
      data: {
        roomId: videoCall.roomId,
        status: videoCall.status,
        participants: [videoCall.initiator, videoCall.participant]
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// End video call
export const endCall = async (req: AuthRequest, res: Response) => {
  try {
    const { callId } = req.params;
    const userId = req.user!._id;

    const videoCall = await VideoCall.findById(callId);
    
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        error: 'Video call not found'
      });
    }

    // Check if user is participant
    if (!videoCall.participant.equals(userId) && !videoCall.initiator.equals(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to end this call'
      });
    }

    // Calculate duration if call was active
    if (videoCall.startTime) {
      const duration = Math.floor((new Date().getTime() - videoCall.startTime.getTime()) / 1000);
      videoCall.duration = duration;
    }

    videoCall.status = 'ended';
    videoCall.endTime = new Date();
    await videoCall.save();

    res.json({
      success: true,
      data: videoCall
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get call history
export const getCallHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const calls = await VideoCall.find({
      $or: [
        { initiator: userId },
        { participant: userId }
      ]
    })
    .populate('initiator', 'name avatar')
    .populate('participant', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await VideoCall.countDocuments({
      $or: [
        { initiator: userId },
        { participant: userId }
      ]
    });

    res.json({
      success: true,
      data: calls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get active calls
export const getActiveCalls = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const activeCalls = await VideoCall.find({
      $or: [
        { initiator: userId },
        { participant: userId }
      ],
      status: { $in: ['pending', 'active'] }
    })
    .populate('initiator', 'name avatar')
    .populate('participant', 'name avatar')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activeCalls
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};