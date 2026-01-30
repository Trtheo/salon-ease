import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
  params: any;
  body: any;
  query: any;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token is no longer valid.' 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Please verify your account first.' 
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token.' 
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. User not authenticated.' 
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${user.role}` 
      });
    }
    
    next();
  };
};