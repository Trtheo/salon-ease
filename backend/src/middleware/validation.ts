import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['customer', 'salon_owner']).withMessage('Invalid role')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validateSalon = [
  body('name').notEmpty().withMessage('Salon name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Please provide a valid email')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};