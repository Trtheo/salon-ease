import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (): string => {
  return uuidv4();
};

export const generateUserId = (): string => {
  return `USER-${uuidv4().substring(0, 8).toUpperCase()}`;
};

export const generateBookingId = (): string => {
  return `BK-${uuidv4().substring(0, 8).toUpperCase()}`;
};

export const generatePaymentId = (): string => {
  return `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
};