import mongoose, { Document } from 'mongoose';
export interface IOTP {
    phone?: string;
    email?: string;
    code: string;
    expiresAt: Date;
    isUsed: boolean;
    attempts: number;
    createdAt?: Date;
}
interface IOTPDocument extends IOTP, Document {
}
declare const _default: mongoose.Model<IOTPDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOTPDocument> & IOTPDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=OTP.d.ts.map