import { Response } from 'express';
export declare const requestAppointment: (req: any, res: Response) => Promise<void>;
export declare const getAppointmentStatus: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUpcomingAppointments: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=appointments.d.ts.map