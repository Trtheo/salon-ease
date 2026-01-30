import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import path from 'path';
import fs from 'fs';

// Upload voice note
export const uploadVoiceMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, duration } = req.body;
    const senderId = req.user!._id;

    if (!(req as any).file) {
      return res.status(400).json({
        success: false,
        error: 'No voice file uploaded'
      });
    }

    const file = (req as any).file;
    
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: 'Voice message',
      messageType: 'voice',
      voiceData: {
        filename: file.filename,
        duration: duration ? parseInt(duration) : undefined,
        size: file.size
      }
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get voice message file
export const getVoiceMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = req.user!._id;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is sender or receiver
    if (!message.sender.equals(userId) && !message.receiver.equals(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this voice message'
      });
    }

    if (message.messageType !== 'voice' || !message.voiceData?.filename) {
      return res.status(400).json({
        success: false,
        error: 'Not a voice message'
      });
    }

    const filePath = path.join('uploads/voice', message.voiceData.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Voice file not found'
      });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};