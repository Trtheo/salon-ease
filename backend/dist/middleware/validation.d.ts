import { Request, Response, NextFunction } from 'express';
export declare const validateRegister: import("express-validator").ValidationChain[];
export declare const validateLogin: import("express-validator").ValidationChain[];
export declare const validateSalon: import("express-validator").ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map