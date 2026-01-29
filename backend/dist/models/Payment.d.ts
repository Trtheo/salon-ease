import mongoose, { Document } from 'mongoose';
export interface IPayment {
    paymentId: string;
    booking: any;
    customer: any;
    amount: number;
    currency: string;
    paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paymentGateway: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface IPaymentDocument extends IPayment, Document {
}
declare const _default: mongoose.Model<IPaymentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPaymentDocument> & IPaymentDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Payment.d.ts.map