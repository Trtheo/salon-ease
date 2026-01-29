import { Request, Response } from 'express';
export declare const getSalons: (req: Request, res: Response) => Promise<void>;
export declare const getSalon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createSalon: (req: any, res: Response) => Promise<void>;
export declare const updateSalon: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSalon: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=salons.d.ts.map