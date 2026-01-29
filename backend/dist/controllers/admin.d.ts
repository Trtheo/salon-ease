import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getAllUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSalonOwners: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserRole: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllSalons: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSalonStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=admin.d.ts.map