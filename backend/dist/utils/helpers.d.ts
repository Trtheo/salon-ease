export declare const generateTimeSlots: (startTime: string, endTime: string, duration: number) => string[];
export declare const isValidTimeSlot: (date: Date, time: string) => boolean;
export declare const formatResponse: (success: boolean, data?: any, error?: string) => {
    error: string;
    data: any;
    success: boolean;
};
export declare const calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
//# sourceMappingURL=helpers.d.ts.map