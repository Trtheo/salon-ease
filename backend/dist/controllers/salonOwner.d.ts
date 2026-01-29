import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getMySalons: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSalonBookings: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBookingStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSalonStats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=salonOwner.d.ts.map