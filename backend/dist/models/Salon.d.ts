import mongoose, { Document } from 'mongoose';
import { ISalon } from '../types';
interface ISalonDocument extends ISalon, Document {
}
declare const _default: mongoose.Model<ISalonDocument, {}, {}, {}, mongoose.Document<unknown, {}, ISalonDocument> & ISalonDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Salon.d.ts.map