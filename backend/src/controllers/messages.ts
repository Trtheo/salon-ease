import { Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { AuthRequest } from '../middleware/auth';

// Send message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.user!._id;

    const messageData: any = {
      sender: senderId,
      receiver: receiverId,
      content,
      messageType
    };

    // Handle voice message
    if (messageType === 'voice' && (req as any).file) {
      const file = (req as any).file;
      messageData.voiceData = {
        filename: file.filename,
        size: file.size,
        duration: req.body.duration ? parseInt(req.body.duration) : undefined
      };
      messageData.content = 'Voice message';
    }

    const message = await Message.create(messageData);

    // Update or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: message._id,
        lastMessageAt: new Date(),
        unreadCount: new Map([[receiverId.toString(), 1]])
      });
    } else {
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = new Date();
      const currentCount = conversation.unreadCount.get(receiverId.toString()) || 0;
      conversation.unreadCount.set(receiverId.toString(), currentCount + 1);
      await conversation.save();
    }

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

// Get conversations
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name avatar role')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get messages in conversation
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user!._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    res.json({
      success: true,
      data: messages.reverse()
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mark messages as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user!._id;

    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Update conversation unread count
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] }
    });

    if (conversation) {
      conversation.unreadCount.set(currentUserId.toString(), 0);
      await conversation.save();
    }

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};