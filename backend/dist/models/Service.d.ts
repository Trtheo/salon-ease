import mongoose, { Document } from 'mongoose';
import { IService } from '../types';
interface IServiceDocument extends IService, Document {
}
declare const _default: mongoose.Model<IServiceDocument, {}, {}, {}, mongoose.Document<unknown, {}, IServiceDocument> & IServiceDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Service.d.ts.map