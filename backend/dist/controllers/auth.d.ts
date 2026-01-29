import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMe: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map