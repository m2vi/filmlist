import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ratingSchema = new Schema({ any: Schema.Types.Mixed }, { strict: false, collection: 'ratings', versionKey: false });

export default mongoose.models.rating || mongoose.model('rating', ratingSchema);
