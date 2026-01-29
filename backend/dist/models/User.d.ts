import mongoose, { Document } from 'mongoose';
import { IUser } from '../types';
interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument> & IUserDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map