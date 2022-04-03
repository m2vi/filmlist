import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false, collection: 'users', versionKey: false });

export default mongoose.models.user || mongoose.model('user', userSchema);
