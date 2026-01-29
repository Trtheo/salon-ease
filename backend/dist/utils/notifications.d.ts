export declare const sendPushNotification: (token: string, title: string, body: string, data?: any) => Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: any;
}>;
export declare const sendBookingConfirmation: (userToken: string, bookingDetails: any) => Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: any;
}>;
export declare const sendAppointmentReminder: (userToken: string, bookingDetails: any) => Promise<{
    success: boolean;
    error?: undefined;
} | {
    success: boolean;
    error: any;
}>;
//# sourceMappingURL=notifications.d.ts.map