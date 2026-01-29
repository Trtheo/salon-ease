import mongoose, { Document } from 'mongoose';
import { IBooking } from '../types';
interface IBookingDocument extends IBooking, Document {
}
declare const _default: mongoose.Model<IBookingDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBookingDocument> & IBookingDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Booking.d.ts.map