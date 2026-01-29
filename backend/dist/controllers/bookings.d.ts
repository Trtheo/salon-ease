import { Response } from 'express';
export declare const getBookings: (req: any, res: Response) => Promise<void>;
export declare const createBooking: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelBooking: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rescheduleBooking: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=bookings.d.ts.map